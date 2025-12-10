# 支出わけっと

スキル向上を目的に、家計管理アプリケーション **支出わけっと** を作成しました。

これはシングルページアプリケーション (SPA) として作成しており、以下の技術を採用しております。
フロントエンド：**TypeScript / Next.js**
バックエンド：**PHP / Laravel**
インフラ：**S3+CloudFront（静的サイト） / ECS（API）**

開発環境には Docker を用いており、フロントエンドとバックエンドを分離したモノレポ構成で開発しています。

# 目次

1. [サービスの概要](#1サービスの概要)
2. [機能一覧](#2機能一覧)
3. [操作画面](#3画面操作)
4. [技術スタック](#4技術スタック)
5. [アプリ開発の振り返り](#5アプリ開発の振り返り)
6. [今後の展望](#6今後の展望)

## 1.サービスの概要

支出管理表と家計簿の機能を統合し、予算設定から実績管理、可視化まで一括で行える家計管理アプリケーションです。<br >
ユーザーモード（個人/共有）を切り替えることで、個人の家計とパートナー都の家計を柔軟に管理できます。

👩 家計簿をつけてはいるけど活用できていない<br >
🧑 恋人/夫婦の支払いの分担・清算に困っている<br >
こんな困りごとを解決するために作成したアプリケーションです。

URL：https://waketto.com/

## 2.機能一覧

- 認証

  - ログイン / ログアウト
    - AWS Cognito による認証
    - JWT トークンベース
    - トークンの自動リフレッシュ（セッション維持）
  - ユーザー登録
    - メールアドレスとパスワードで登録
    - 確認コードによるメールアドレス検証

- アカウント管理

  - ユーザー名の変更
  - パートナー連携 / 解除
  - パスワードの変更 / リセット
  - メールアドレスの変更
  - アカウント削除

- ユーザーモード切り替え

  - 個人モード
    - ログインユーザーが登録した明細のみ表示
  - 共有モード
    - ログインユーザーとそのパートナーが登録した明細が表示
    - 支払い担当者を記録し、分担を可視化

- 明細管理

  - 明細の登録 / 更新 / 削除
  - ファイナンスモード切り替えによる表示変更
  - 明細の表示（月次ビュー）

    - テーブル形式での明細一覧表示
    - カテゴリー別円グラフによる支出割合の可視化
    - 月間合計金額の表示

  - 明細の表示（年次ビュー）

    - カテゴリー別・月別の支出推移を棒グラフで可視

- 予算管理

  - カテゴリー別に予算の登録 / 更新
  - 月別予算消化状況の表示
  - 残予算の自動計算

- サブスクリプション管理

  - サブスクリプション登録 / 更新 / 削除
  - 登録したサブスクリプションを月次明細に自動反映

## 3.画面

### 3-1.新規登録 / ログインの画面

### 3-2.支出管理 / 家計簿の画面

### 3-3.予算 / サブスクリプションの設定画面

### 3-4.アカウントの設定画面

## 4.技術スタック

### 4-1.使用技術一覧

#### フロントエンド

フロントエンドの開発言語として**TypeScript**を使用し、フレームワークとして使用したのは**Next.js**です。App Router を採用し、React Server Components (RSC) と Client Components を適切に使い分けています。

- [Next.js](https://nextjs.org) (15.5.2) - React フレームワーク (App Router)
- [React](https://reactjs.org) (19.1.0) - UI ライブラリ
- [TypeScript](https://www.typescriptlang.org/) (5 系) - 型安全性
- [AWS Amplify](https://docs.amplify.aws/) (6.15.6) - Cognito 認証
- [TailwindCSS](https://tailwindcss.com/) (4 系) - CSS フレームワーク
- [Radix UI](https://www.radix-ui.com/) - アクセシブルな UI コンポーネント
- [SWR](https://swr.vercel.app/) (2.3.6) - データフェッチング
- [Recharts](https://recharts.org/) (2.15.4) - チャート描画
- [date-fns](https://date-fns.org/) (4.1.0) - 日付処理
- [Lucide React](https://lucide.dev/) - アイコンライブラリ
- [Sonner](https://sonner.emilkowal.ski/) (2.0.7) - トースト通知
- [next-themes](https://github.com/pacocoursey/next-themes) (0.4.6) - ダークモード
- [ESLint](https://eslint.org/) (9.34.0) - リンター
- [Prettier](https://prettier.io/) (3.6.2) - フォーマッター

**フロントエンドの責任**

- AWS Cognito による認証（ログイン・ログアウト・サインアップ）
- Amplify によるトークン管理
- 認証フォームの UI
- JWT トークン付き API 呼び出し
- データの表示とユーザーインタラクション

#### バックエンド

バックエンドの開発言語には**PHP**、Web アプリケーションフレームワークには**Laravel**を利用しました。開発環境の構築には、**Docker**と**Docker Compose**を用いており、これを実行することで開発用のサーバーが起動し、データベースや API サーバーを含む環境が整います。

- [PHP](https://www.php.net/) (8.2+) - プログラミング言語
- [Laravel](https://laravel.com/) (12.0) - Web アプリケーションフレームワーク
- [MySQL](https://www.mysql.com/) (8.4) - リレーショナルデータベース
- [Composer](https://getcomposer.org/) - 依存関係管理
- [AWS SDK for PHP](https://aws.amazon.com/sdk-for-php/) (3.356) - AWS 連携
- [Firebase JWT](https://github.com/firebase/php-jwt) (6.11) - JWT 検証
- [PHPUnit](https://phpunit.de/) (11.5.3) - テストフレームワーク
- [Laravel Pint](https://laravel.com/docs/12.x/pint) (1.13) - コードスタイル整形
- [Laravel Sail](https://laravel.com/docs/12.x/sail) (1.41) - Docker 開発環境

**バックエンドの責任**

- JWT トークン検証（Cognito 発行トークン）
- データベース操作（CRUD）
- ビジネスロジック（予算計算、集計など）
- API エンドポイント提供
- データバリデーション

**認証**

認証には**AWS Amplify v6**を用い、Cognito 認証を実装しています。

### 4-2.データベース設計（ER 図）

ER 図を後から追加

### 4-3.インフラ構成図

**開発環境**

- [Docker](https://www.docker.com/) - コンテナ管理
- [Docker Compose](https://docs.docker.com/compose/) - マルチコンテナ管理
- [AWS Cognito](https://aws.amazon.com/cognito/) - 認証・認可サービス
- [Nginx](https://nginx.org/) - Web サーバー

**本番環境**

AWS のインフラ構成図を後から追加

## 5.アプリ開発の振り返り

## 6.今後の展望
