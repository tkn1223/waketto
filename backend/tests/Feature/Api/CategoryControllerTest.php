<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Database\Seeders\CategoriesSeeder;
use Database\Seeders\CategoryGroupsTableSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * テストデータの作成と認証の設定
     */
    protected function setUp(): void
    {
        parent::setUp();

        // テストデータの作成
        $this->seed(CategoryGroupsTableSeeder::class);
        $this->seed(CategoriesSeeder::class);

        // 認証用のユーザーを作成
        $user = User::factory()->create();

        // CognitoJwtAuthミドルウェアをモックして認証をバイパス
        $this->mock(\App\Http\Middleware\CognitoJwtAuth::class, function ($mock) use ($user) {
            $mock->shouldReceive('handle')
                ->andReturnUsing(function ($request, $next) use ($user) {
                    // リクエストに認証済みユーザー情報を設定
                    $request->attributes->set('auth_user', $user);

                    return $next($request);
                });
        });
    }

    /**
     * APIが正常に動作し、期待通りのデータを返すことを確認
     */
    public function test_index_returns_expected_response()
    {
        $response = $this->getJson('/api/categories');
        $data = $response->json('data');

        // HTTPステータスと基本構造を確認
        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    '*' => [
                        'group_name',
                        'categories' => [
                            '*' => ['id', 'name', 'code'],
                        ],
                    ],
                ],
            ]);

        // 6つのグループが存在することを確認（Seederの内容）
        $this->assertCount(6, $data, '6つのカテゴリーグループが返されること');

        // グループ名のサンプルチェック（リレーションが正しく動作しているか）
        $this->assertEquals('毎月固定費', $data['monthly_fixed_cost']['group_name']);
        $this->assertEquals('貯蓄・投資', $data['savings_investment_cost']['group_name']);

        // カテゴリー数のサンプルチェック（データが正しく取得できているか）
        $this->assertCount(7, $data['monthly_fixed_cost']['categories']);
        $this->assertCount(1, $data['savings_investment_cost']['categories']);

        // 特定のカテゴリーの存在確認（データの整合性）
        $housingCost = collect($data['monthly_fixed_cost']['categories'])
            ->firstWhere('code', 'housing_cost');
        $this->assertNotNull($housingCost);
        $this->assertEquals('住居費', $housingCost['name']);
    }
}
