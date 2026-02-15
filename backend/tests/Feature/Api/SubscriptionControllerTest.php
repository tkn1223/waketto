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
            'service_name' => 'Netflix',
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
            ->assertJsonPath('data.0.name', 'Netflix')
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
            'service_name' => 'Spotify',
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
            ->assertJsonPath('data.0.name', 'Spotify')
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
}
