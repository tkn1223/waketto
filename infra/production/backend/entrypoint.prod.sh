#!/bin/bash
set -e

echo "Start entrypoint.prod.sh"

# 環境変数確認
echo "APP_ENV: $APP_ENV"
echo "APP_DEBUG: $APP_DEBUG"

# デバッグ：環境変数の詳細出力
echo "=== Database Configuration ==="
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "DB_DATABASE: $DB_DATABASE"
echo "DB_CONNECTION: $DB_CONNECTION"
echo "DB_USERNAME: $DB_USERNAME"
echo "=== End Debug ==="

# DB リセット（必要に応じて）
# echo "Resetting database..."
# php artisan migrate:fresh --force || echo "Migration fresh failed, continuing..."
# echo "Database reset completed!"

# DB接続待機ループ（起動順序問題の解決）
echo "Waiting for database connection..."
max_attempts=5
attempt=1

while [ $attempt -le $max_attempts ]; do
    echo "Attempt $attempt/$max_attempts: Testing database connection..."
    
    # 設定キャッシュをクリア（環境変数の反映を確実にする）
    php artisan config:clear || echo "Config clear failed, continuing..."
    
    # DB接続テスト - migrate:status で接続確認（実行ではなく状態確認）
    if php artisan migrate:status > /dev/null 2>&1; then
        echo "Database connection successful!"
        break
    else
        echo "Database connection failed. Waiting 5 seconds..."
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
    exit 1
fi

# マイグレーションテーブルが存在するかを確認（初回実行判定）
echo "Checking if migrations table exists..."
MIGRATION_STATUS_OUTPUT=$(php artisan migrate:status 2>&1)

# migrate:statusの出力に"Migration name"が含まれていればmigrationsテーブルが存在する
if echo "$MIGRATION_STATUS_OUTPUT" | grep -q "Migration name"; then
    echo "Migrations table exists. Skipping migrations and seeders on subsequent runs."
    MIGRATIONS_TABLE_EXISTS="true"
else
    echo "Migrations table does not exist. This is the first deployment."
    MIGRATIONS_TABLE_EXISTS="false"
fi

# 初回実行のみマイグレーションとシーダーを実行
if [ "$MIGRATIONS_TABLE_EXISTS" = "false" ]; then
    echo "First deployment detected. Running migrations and seeders..."
    
    # マイグレーション実行
    echo "Running: php artisan migrate --force"
    php artisan migrate --force || echo "Migration failed, but continuing..."
    
    # シーダー実行
    echo "Running: php artisan db:seed --force"
    php artisan db:seed --force || echo "No seeders to run"
    
    echo "First deployment setup completed."
fi

# キャッシュクリア（本番環境用）
echo "php artisan cache:clear"
php artisan cache:clear

# 本番環境用キャッシュ生成
echo "php artisan config:cache"
php artisan config:cache

echo "php artisan route:cache"
php artisan route:cache

echo "php artisan view:cache"
php artisan view:cache

# ストレージリンク（必要に応じて）
echo "php artisan storage:link"
php artisan storage:link || echo "Storage link already exists"

# Laravelアプリケーションサーバー起動（Rails教材を参考）
echo "Starting Laravel application server"
php artisan serve --host=0.0.0.0 --port=8000 &

# PHP-FPM起動
echo "Starting PHP-FPM"
exec php-fpm