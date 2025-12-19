-- テスト用データベースの作成
CREATE DATABASE IF NOT EXISTS waketto_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- テストユーザーに権限を付与
GRANT ALL PRIVILEGES ON waketto_test.* TO 'waketto_user'@'%';
FLUSH PRIVILEGES;

