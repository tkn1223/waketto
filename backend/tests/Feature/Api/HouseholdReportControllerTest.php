<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Database\Seeders\CategoriesSeeder;
use Database\Seeders\CategoryGroupsTableSeeder;
use Database\Seeders\PaymentsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HouseholdReportControllerTest extends TestCase
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

        // 支払いデータを作成（ユーザーIDを渡す）
        $paymentsSeeder = new PaymentsSeeder();
        $paymentsSeeder->run($user->id);

        // CognitoJwtAuthミドルウェアをモックして認証をバイパス
        $this->mock(\App\Http\Middleware\CognitoJwtAuth::class, function ($mock) use ($user) {
            $mock->shouldReceive('handle')
                ->andReturnUsing(function ($request, $next) use ($user) {
                    $request->attributes->set('auth_user', $user);

                    return $next($request);
                });
        });
    }

    /**
     * 家計簿APIが正常に動作し、正しい構造を返すことを確認
     */
    public function test_index_returns_expected_response()
    {
        // PaymentsSeederで2025年1月のデータを作成しているので、その年月を指定
        $response = $this->getJson('/api/household-report/alone?year=2025&month=1');
        $data = $response->json('data');

        // HTTPステータスと基本構造を確認
        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    'monthly_fixed_cost' => [
                        'group_name',
                        'categories',
                    ],
                    'monthly_variable_cost' => [
                        'group_name',
                        'categories',
                    ],
                ],
            ])
            ->assertJson([
                'status' => true,
            ]);

        // カテゴリーグループが正しく返されることを確認
        $expectedGroups = [
            'monthly_fixed_cost', 'monthly_variable_cost', 'occasional_fixed_cost',
            'occasional_variable_cost', 'luxury_consumption_cost', 'savings_investment_cost',
        ];
        foreach ($expectedGroups as $groupCode) {
            $this->assertArrayHasKey($groupCode, $data, "カテゴリーグループ{$groupCode}が返されること");
            $this->assertArrayHasKey('group_name', $data[$groupCode]);
            $this->assertArrayHasKey('categories', $data[$groupCode]);
        }

        // 毎月固定費のグループ名が正しいことを確認
        $this->assertEquals('毎月固定費', $data['monthly_fixed_cost']['group_name']);

        // 毎月固定費に住居費カテゴリーが含まれることを確認
        $this->assertArrayHasKey('housing_cost', $data['monthly_fixed_cost']['categories']);
        $this->assertEquals('住居費', $data['monthly_fixed_cost']['categories']['housing_cost']['category_name']);
        
        // PaymentsSeederで住居費（housing_cost）の支払いデータを作成しているので、それが取得されることを確認
        $this->assertNotEmpty($data['monthly_fixed_cost']['categories']['housing_cost']['payments'], '住居費の支払いデータが存在すること');
        $housingPayment = $data['monthly_fixed_cost']['categories']['housing_cost']['payments'][0];
        $this->assertEquals(80000, $housingPayment['amount'], '住居費の金額が正しいこと');

        // 毎月変動費に食費カテゴリーが含まれることを確認
        $this->assertArrayHasKey('food_cost', $data['monthly_variable_cost']['categories']);
        $this->assertEquals('食費', $data['monthly_variable_cost']['categories']['food_cost']['category_name']);
        
        // PaymentsSeederで食費（food_cost）の支払いデータを作成しているので、それが取得されることを確認
        $this->assertNotEmpty($data['monthly_variable_cost']['categories']['food_cost']['payments'], '食費の支払いデータが存在すること');
        $this->assertCount(2, $data['monthly_variable_cost']['categories']['food_cost']['payments'], '食費の支払いが2件あること');
    }
}

