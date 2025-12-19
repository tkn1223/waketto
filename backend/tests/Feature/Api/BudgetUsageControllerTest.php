<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Database\Seeders\BudgetsSeeder;
use Database\Seeders\CategoriesSeeder;
use Database\Seeders\CategoryGroupsTableSeeder;
use Database\Seeders\PaymentsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BudgetUsageControllerTest extends TestCase
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
        $user = User::factory()->create([
            'couple_id' => null,
        ]);

        // 予算データを作成（ユーザーIDを渡す）
        $budgetsSeeder = new BudgetsSeeder;
        $budgetsSeeder->run($user->id);

        // 支払いデータを作成（ユーザーIDを渡す）
        $paymentsSeeder = new PaymentsSeeder;
        $paymentsSeeder->run($user->id);

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
     * 予算使用量APIが正常に動作することを確認
     */
    public function test_index_returns_expected_response()
    {
        $response = $this->getJson('/api/budget/usage/alone');
        $data = $response->json('data');

        // HTTPステータスと基本構造を確認
        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    '*' => [
                        'id',
                        'category' => [
                            'id',
                            'name',
                            'code',
                        ],
                        'budget_amount',
                        'period_type',
                        'monthly_data' => [
                            '*' => [
                                'month',
                                'category_id',
                                'amount',
                                'payment_ids',
                            ],
                        ],
                        'residue_budget',
                    ],
                ],
            ]);

        // 予算データが返されることを確認
        $this->assertIsArray($data, 'dataが配列であること');
        $this->assertNotEmpty($data, '予算データが存在すること');

        // BudgetsSeederで3件の予算を作成しているので3件返される
        $this->assertCount(3, $data, '3件の予算データが返されること');

        // サンプルチェック（最初の予算データ）
        $firstItem = $data[0];

        // 基本的なフィールドの存在確認
        $this->assertArrayHasKey('category', $firstItem);
        $this->assertArrayHasKey('budget_amount', $firstItem);
        $this->assertArrayHasKey('monthly_data', $firstItem);

        // カテゴリー情報が正しく取得できているか
        $this->assertIsArray($firstItem['category']);
        $this->assertArrayHasKey('id', $firstItem['category']);
        $this->assertArrayHasKey('name', $firstItem['category']);
        $this->assertArrayHasKey('code', $firstItem['category']);

        // monthly_dataが12ヶ月分あることを確認
        $this->assertCount(12, $firstItem['monthly_data'], '12ヶ月分のデータがあること');

        // monthly_dataの最初の月のデータを確認
        $this->assertEquals(1, $firstItem['monthly_data'][0]['month'], '1月のデータがあること');
    }

    /**
     * 予算設定APIが正常に動作し、groupCodeが正しく取得できることを確認
     */
    public function test_budget_setting_returns_expected_response()
    {
        $response = $this->getJson('/api/budget/setting/alone');
        $data = $response->json('data');

        // HTTPステータスと基本構造を確認
        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    '*' => [
                        'name',
                        'code',
                        'groupCode',
                        'period',
                        'periodType',
                        'amount',
                    ],
                ],
            ]);

        // 予算設定データが返されることを確認
        $this->assertIsArray($data, 'dataが配列であること');
        $this->assertNotEmpty($data, '予算設定データが存在すること');

        // BudgetsSeederで3件の予算を作成しているので3件返される
        $this->assertCount(3, $data, '3件の予算設定データが返されること');

        // サンプルチェック（最初の予算設定データ）
        $firstItem = $data[0];

        // 基本的なフィールドの存在確認
        $this->assertArrayHasKey('name', $firstItem);
        $this->assertArrayHasKey('code', $firstItem);
        $this->assertArrayHasKey('groupCode', $firstItem);
        $this->assertArrayHasKey('periodType', $firstItem);
        $this->assertArrayHasKey('amount', $firstItem);

        // groupCodeが正しく取得できているか確認
        $this->assertNotEmpty($firstItem['groupCode'], 'groupCodeが取得できていること');
        $this->assertContains(
            $firstItem['groupCode'],
            ['monthly_fixed_cost', 'monthly_variable_cost', 'occasional_fixed_cost',
                'occasional_variable_cost', 'luxury_consumption_cost', 'savings_investment_cost'],
            'groupCodeが有効なカテゴリーグループコードであること'
        );
    }
}
