#　起動方法

```
cd inrfa
docker compose up -d --build
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
