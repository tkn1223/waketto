#　起動方法

## コンテナの立ち上げ

```bash
cd inrfa
docker compose up -d --build
```

## バックエンドのコンテナに入る

```bash
docker compose exec backend bash
```

## Seed ファイルの実行

```docker
php artisan db:seed
```

ページにアクセス
http://localhost:3000/

# コンテナ操作

```be
docker compose exec -it backend bash
```

```fe
docker compose exec -it frontend bash
```

# ESLint を動かす

```bash
# 全ファイルのチェック
pnpm eslint

# 全ファイルの自動修正
pnpm eslint --fix
```

こんな使い方もできる

```bash
# 特定のフォルダ内のみチェック
pnpm eslint src/

# 特定ファイルのみチェック
pnpm eslint src/components/Button.tsx
```

# 使用技術

認証
OIDC プロバイダ：Cognito
フロントエンド：Amplify
