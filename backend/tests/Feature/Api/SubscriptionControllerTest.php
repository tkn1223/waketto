<?php

namespace Tests\Feature\Api;

use App\Models\Couple;
use App\Models\Subscription;
use App\Models\User;
use Database\Seeders\CategoriesSeeder;
use Database\Seeders\CategoryGroupsTableSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\Common\MocksCognitoAuth;
use Tests\TestCase;

class SubscriptionControllerTest extends TestCase
{
    use MocksCognitoAuth;
    use RefreshDatabase;

    protected User $user;

    protected User $partner;

    protected Couple $couple;

    protected function setUp(): void
    {
        parent::setUp();

        // category groupとcategoryをseederで作成
        $this->seed(CategoryGroupsTableSeeder::class);
        $this->seed(CategoriesSeeder::class);

        $this->user = User::factory()->create();
        $this->partner = User::factory()->create();

        $this->couple = Couple::create([
            'name' => $this->user->user_id.' & '.$this->partner->user_id,
        ]);

        $this->user->update(['couple_id' => $this->couple->id]);
        $this->partner->update(['couple_id' => $this->couple->id]);

        $this->mockCognitoAuth($this->user);
    }

    /**
     * 正常系 - 取得：alone モードでサブスクリプションを取得できることを確認
     */
    public function test_get_subscriptions_in_alone_mode_returns_subscriptions(): void
    {
        Subscription::create([
            'recorded_by_user_id' => $this->user->id,
            'couple_id' => null,
            'service_name' => 'サブスク１',
            'amount' => 980,
            'billing_interval' => 'monthly',
            'start_date' => '2025-01-01',
            'finish_date' => '2025-12-31',
        ]);

        $response = $this->getJson('/api/subscription/setting/alone');

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
            ])
            ->assertJsonPath('data.0.name', 'サブスク１')
            ->assertJsonPath('data.0.updatePeriod', 'monthly')
            ->assertJsonPath('data.0.amount', 980)
            ->assertJsonPath('data.0.startDate', '2025-01-01')
            ->assertJsonPath('data.0.finishDate', '2025-12-31');

        $data = $response->json('data.0');
        $this->assertArrayHasKey('id', $data);
        $this->assertIsString($data['id']);
        $this->assertSame(1, count($response->json('data')));
    }

    /**
     * 正常系 - 取得：common モードでサブスクリプションを取得できることを確認
     */
    public function test_get_subscriptions_in_common_mode_returns_subscriptions(): void
    {
        Subscription::create([
            'recorded_by_user_id' => $this->user->id,
            'couple_id' => $this->couple->id,
            'service_name' => 'サブスク２',
            'amount' => 1280,
            'billing_interval' => 'yearly',
            'start_date' => '2025-04-01',
            'finish_date' => '2026-03-31',
        ]);

        $response = $this->getJson('/api/subscription/setting/common');

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
            ])
            ->assertJsonPath('data.0.name', 'サブスク２')
            ->assertJsonPath('data.0.updatePeriod', 'yearly')
            ->assertJsonPath('data.0.amount', 1280);

        $this->assertSame(1, count($response->json('data')));
    }

    /**
     * 正常系 - 取得：サブスクリプションが0件の場合
     */
    public function test_get_subscriptions_returns_empty_array_when_no_subscriptions(): void
    {
        $response = $this->getJson('/api/subscription/setting/alone');

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'data' => [],
            ]);
    }

    /**
     * 正常系 - 更新：alone モードでサブスクリプションを更新できることを確認
     */
    public function test_update_subscriptions_in_alone_mode_succeeds(): void
    {
        $requestBody = [
            'subscriptions' => [
                [
                    'name' => 'サブスク１',
                    'updatePeriod' => 'monthly',
                    'amount' => 980,
                    'startDate' => '2025-01-01',
                    'finishDate' => '2025-12-31',
                ],
            ],
        ];

        $response = $this->postJson('/api/subscription/setting/updateSubscriptions/alone', $requestBody);

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'サブスクリプションの設定に成功しました',
            ]);

        $this->assertDatabaseHas('subscriptions', [
            'recorded_by_user_id' => $this->user->id,
            'couple_id' => null,
            'service_name' => 'サブスク１',
            'amount' => 980,
            'billing_interval' => 'monthly',
        ]);
    }

    /**
     * 正常系 - 更新：common モードでサブスクリプションを更新できることを確認
     */
    public function test_update_subscriptions_in_common_mode_succeeds(): void
    {
        $requestBody = [
            'subscriptions' => [
                [
                    'name' => 'サブスク２',
                    'updatePeriod' => 'monthly',
                    'amount' => 1280,
                    'startDate' => '2025-01-01',
                    'finishDate' => '2025-12-31',
                ],
            ],
        ];

        $response = $this->postJson('/api/subscription/setting/updateSubscriptions/common', $requestBody);

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'サブスクリプションの設定に成功しました',
            ]);

        $this->assertDatabaseHas('subscriptions', [
            'recorded_by_user_id' => $this->user->id,
            'couple_id' => $this->couple->id,
            'service_name' => 'サブスク２',
            'amount' => 1280,
        ]);
    }

    /**
     * 正常系 - 更新：既存サブスクリプションを完全置換できることを確認
     */
    public function test_update_subscriptions_replaces_existing_subscriptions(): void
    {
        Subscription::create([
            'recorded_by_user_id' => $this->user->id,
            'couple_id' => null,
            'service_name' => 'OldService',
            'amount' => 100,
            'billing_interval' => 'monthly',
            'start_date' => '2024-01-01',
            'finish_date' => '2024-12-31',
        ]);

        $requestBody = [
            'subscriptions' => [
                [
                    'name' => 'NewService',
                    'updatePeriod' => 'monthly',
                    'amount' => 500,
                    'startDate' => '2025-01-01',
                    'finishDate' => '2025-12-31',
                ],
            ],
        ];

        $response = $this->postJson('/api/subscription/setting/updateSubscriptions/alone', $requestBody);

        $response->assertStatus(200);

        $this->assertDatabaseMissing('subscriptions', [
            'recorded_by_user_id' => $this->user->id,
            'service_name' => 'OldService',
        ]);
        $this->assertDatabaseHas('subscriptions', [
            'recorded_by_user_id' => $this->user->id,
            'service_name' => 'NewService',
            'amount' => 500,
        ]);
        $this->assertSame(1, Subscription::where('recorded_by_user_id', $this->user->id)->whereNull('couple_id')->count());
    }

    /**
     * 正常系 - 更新：複数件のサブスクリプションを更新できることを確認
     */
    public function test_update_subscriptions_transaction_commits_successfully(): void
    {
        $requestBody = [
            'subscriptions' => [
                [
                    'name' => 'サブスク１',
                    'updatePeriod' => 'monthly',
                    'amount' => 980,
                    'startDate' => '2025-01-01',
                    'finishDate' => '2025-12-31',
                ],
                [
                    'name' => 'サブスク２',
                    'updatePeriod' => 'monthly',
                    'amount' => 1280,
                    'startDate' => '2025-01-01',
                    'finishDate' => '2025-12-31',
                ],
            ],
        ];

        $response = $this->postJson('/api/subscription/setting/updateSubscriptions/alone', $requestBody);

        $response->assertStatus(200);

        $this->assertSame(2, Subscription::where('recorded_by_user_id', $this->user->id)->whereNull('couple_id')->count());
        $this->assertDatabaseHas('subscriptions', [
            'recorded_by_user_id' => $this->user->id,
            'service_name' => 'サブスク１',
        ]);
        $this->assertDatabaseHas('subscriptions', [
            'recorded_by_user_id' => $this->user->id,
            'service_name' => 'サブスク２',
        ]);
    }

    /**
     * 正常系 - 更新：2件登録済みの状態で1件だけ送ると、送らなかった1件が削除されることを確認
     */
    public function test_update_subscriptions_deletes_omitted_subscriptions(): void
    {
        Subscription::create([
            'recorded_by_user_id' => $this->user->id,
            'couple_id' => null,
            'service_name' => 'サブスク１',
            'amount' => 980,
            'billing_interval' => 'monthly',
            'start_date' => '2025-01-01',
            'finish_date' => '2025-12-31',
        ]);
        Subscription::create([
            'recorded_by_user_id' => $this->user->id,
            'couple_id' => null,
            'service_name' => 'サブスク２',
            'amount' => 1280,
            'billing_interval' => 'monthly',
            'start_date' => '2025-01-01',
            'finish_date' => '2025-12-31',
        ]);

        $requestBody = [
            'subscriptions' => [
                [
                    'name' => 'サブスク１',
                    'updatePeriod' => 'monthly',
                    'amount' => 980,
                    'startDate' => '2025-01-01',
                    'finishDate' => '2025-12-31',
                ],
            ],
        ];

        $response = $this->postJson('/api/subscription/setting/updateSubscriptions/alone', $requestBody);

        $response->assertStatus(200);

        $this->assertSame(1, Subscription::where('recorded_by_user_id', $this->user->id)->whereNull('couple_id')->count());
        $this->assertDatabaseHas('subscriptions', [
            'recorded_by_user_id' => $this->user->id,
            'service_name' => 'サブスク１',
        ]);
        $this->assertDatabaseMissing('subscriptions', [
            'recorded_by_user_id' => $this->user->id,
            'service_name' => 'サブスク２',
        ]);
    }

    /**
     * 異常系 - 更新：updatePeriod が monthly/yearly 以外の場合に422エラーを返すことを確認
     */
    public function test_update_subscriptions_fails_when_update_period_invalid(): void
    {
        $requestBody = [
            'subscriptions' => [
                [
                    'name' => 'サブスク１',
                    'updatePeriod' => 'weekly',
                    'amount' => 980,
                    'startDate' => '2025-01-01',
                    'finishDate' => '2025-12-31',
                ],
            ],
        ];

        $response = $this->postJson('/api/subscription/setting/updateSubscriptions/alone', $requestBody);

        $response->assertStatus(422);
        $errors = $response->json('errors');
        $this->assertArrayHasKey('subscriptions.0.updatePeriod', $errors);
        $this->assertSame('更新間隔は「カ月」または「年」を選択してください', $errors['subscriptions.0.updatePeriod'][0]);
    }

    /**
     * 異常系 - 更新：終了日が開始日より前の場合に422エラーを返すことを確認
     */
    public function test_update_subscriptions_fails_when_finish_date_before_start_date(): void
    {
        $requestBody = [
            'subscriptions' => [
                [
                    'name' => 'サブスク１',
                    'updatePeriod' => 'monthly',
                    'amount' => 980,
                    'startDate' => '2025-12-01',
                    'finishDate' => '2025-01-01',
                ],
            ],
        ];

        $response = $this->postJson('/api/subscription/setting/updateSubscriptions/alone', $requestBody);

        $response->assertStatus(422);
        $errors = $response->json('errors');
        $this->assertArrayHasKey('subscriptions.0.finishDate', $errors);
        $this->assertSame('終了日は開始日以降の日付を入力してください', $errors['subscriptions.0.finishDate'][0]);
    }

    /**
     * 異常系 - 更新：トランザクション失敗時のロールバック
     */
    public function test_update_subscriptions_rollback_on_failure(): void
    {
        $callCount = 0;
        Event::listen('eloquent.creating: '.Subscription::class, function ($model) use (&$callCount) {
            $callCount++;
            if ($callCount >= 2) {
                throw new \RuntimeException('Simulated failure for rollback test');
            }
        });

        $requestBody = [
            'subscriptions' => [
                [
                    'name' => 'First',
                    'updatePeriod' => 'monthly',
                    'amount' => 980,
                    'startDate' => '2025-01-01',
                    'finishDate' => '2025-12-31',
                ],
                [
                    'name' => 'Second',
                    'updatePeriod' => 'monthly',
                    'amount' => 980,
                    'startDate' => '2025-01-01',
                    'finishDate' => '2025-12-31',
                ],
            ],
        ];

        $response = $this->postJson('/api/subscription/setting/updateSubscriptions/alone', $requestBody);

        $response->assertStatus(500);

        $this->assertSame(0, Subscription::where('recorded_by_user_id', $this->user->id)->whereNull('couple_id')->count());
    }
}
