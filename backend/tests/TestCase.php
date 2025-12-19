<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /*
     * Docker環境変数を上書きしてテスト専用DBを使用する
     */
    public function createApplication()
    {
        $app = parent::createApplication();

        // テスト用のデータベース設定を強制的に適用（RefreshDatabaseトレイトが実行される前に適用）
        // 開発用DB（development）ではなく、テスト専用DB（waketto_test）を使用
        config([
            'database.default' => 'mysql',
            'database.connections.mysql.database' => 'waketto_test',
        ]);

        return $app;
    }
}
