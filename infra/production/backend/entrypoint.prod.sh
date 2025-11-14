#!/bin/bash
set -e

echo "Start entrypoint.prod.sh"

# DB接続待機ループ（起動順序問題の解決）
echo "Waiting for database connection..."
max_attempts=5
attempt=1
MIGRATIONS_TABLE_EXISTS=""        # unknown / true / false
LAST_MIGRATE_STATUS_ERROR=""      # 失敗時の最後のエラーメッセージ

while [ $attempt -le $max_attempts ]; do
    echo "Attempt $attempt/$max_attempts: Testing database connection..."
    
    # 設定キャッシュをクリア
    php artisan config:clear || echo "Config clear failed, continuing..."

    # set -e の影響を避けつつ migrate:status の結果と出力を取得
    set +e
    MIGRATION_STATUS_OUTPUT=$(php artisan migrate:status 2>&1)
    status=$?
    set -e

    if [ $status -eq 0 ]; then
        # 接続成功 & migrations テーブルあり
        echo "Database connection successful (migrations table exists)."
        MIGRATIONS_TABLE_EXISTS="true"
        break
    elif echo "$MIGRATION_STATUS_OUTPUT" | grep -qi "Migration table not found"; then
        # 接続成功 & migrations テーブルなし（＝新規DB想定）
        echo "Database connection successful, but migrations table is missing (fresh database)."
        MIGRATIONS_TABLE_EXISTS="false"
        break
    else
        # 本当の接続失敗など
        echo "Database connection failed. Waiting 5 seconds..."
        echo "--- Database connection error detail ---"
        echo "$MIGRATION_STATUS_OUTPUT"
        echo "----------------------------------------"
        LAST_MIGRATE_STATUS_ERROR="$MIGRATION_STATUS_OUTPUT"
        sleep 5
        attempt=$((attempt + 1))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    echo "ERROR: Could not connect to database after $max_attempts attempts"
    echo "Please check:"
    echo "1. DB_HOST: $DB_HOST"
    echo "2. DB_PORT: $DB_PORT"
    echo "3. DB_DATABASE: $DB_DATABASE"
    echo "4. Security groups and network configuration"
    if [ -n "$LAST_MIGRATE_STATUS_ERROR" ]; then
        echo "Last error from php artisan migrate:status:"
        echo "$LAST_MIGRATE_STATUS_ERROR"
    fi
    exit 1
fi

# 任意のリセット（DB_RESET_ON_STARTUP=true の場合のみ実行）
if [ "${DB_RESET_ON_STARTUP:-false}" = "true" ]; then
    echo "DB_RESET_ON_STARTUP is true. Running: php artisan db:wipe --force"
    if ! php artisan db:wipe --force; then
        echo "Database wipe failed."
        exit 1
    fi
    # db:wipe したので migrations テーブルは必ず消えている前提
    MIGRATIONS_TABLE_EXISTS="false"
fi

# マイグレーションテーブルが未判定の場合だけ、フォールバックで確認
if [ -z "$MIGRATIONS_TABLE_EXISTS" ]; then
    echo "Checking if migrations table exists (fallback)..."

    set +e
    MIGRATION_STATUS_OUTPUT=$(php artisan migrate:status 2>&1)
    status=$?
    set -e

    if [ $status -eq 0 ] && echo "$MIGRATION_STATUS_OUTPUT" | grep -q "Migration name"; then
        echo "Migrations table exists."
        MIGRATIONS_TABLE_EXISTS="true"
    elif echo "$MIGRATION_STATUS_OUTPUT" | grep -qi "Migration table not found"; then
        echo "Migrations table does not exist."
        MIGRATIONS_TABLE_EXISTS="false"
    else
        echo "Warning: Could not determine migrations table state from migrate:status output."
        MIGRATIONS_TABLE_EXISTS="unknown"
    fi
else
    echo "Migrations table existence already determined during DB check: $MIGRATIONS_TABLE_EXISTS"
fi

# マイグレーション実行
echo "Running: php artisan migrate --force"
if ! php artisan migrate --force; then
    echo "Migration failed. Please check the database connection and migration files."
    exit 1
fi

# シーダーは「migrations テーブルがなかったとき」だけ実行
if [ "$MIGRATIONS_TABLE_EXISTS" = "false" ]; then
    echo "First deployment detected. Running seeders..."
    echo "Running: php artisan db:seed --force"
    if ! php artisan db:seed --force; then
        echo "Database seeding failed."
        exit 1
    fi
    echo "First deployment setup completed."
fi

# キャッシュクリア
echo "php artisan cache:clear"
php artisan cache:clear

# 本番環境用キャッシュ生成
echo "php artisan config:cache"
php artisan config:cache

echo "php artisan route:cache"
php artisan route:cache

echo "php artisan view:cache"
php artisan view:cache

# ストレージリンク
echo "php artisan storage:link"
php artisan storage:link || echo "Storage link already exists"

# Laravelアプリケーションサーバー起動
echo "Starting Laravel application server"
php artisan serve --host=0.0.0.0 --port=8000 &

# PHP-FPM起動
echo "Starting PHP-FPM"
exec php-fpm
