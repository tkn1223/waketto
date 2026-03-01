<?php

namespace Tests\Feature\Api;

use App\Http\Middleware\CognitoJwtAuth;
use App\Models\Budget;
use App\Models\Category;
use App\Models\Couple;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use Database\Seeders\CategoriesSeeder;
use Database\Seeders\CategoryGroupsTableSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Common\MocksCognitoAuth;
use Tests\TestCase;

class SettingControllerTest extends TestCase
{
    use MocksCognitoAuth;
    use RefreshDatabase;

    protected User $user;

    protected User $partner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(CategoryGroupsTableSeeder::class);
        $this->seed(CategoriesSeeder::class);

        $this->user = User::factory()->create();
        $this->partner = User::factory()->create();

        $this->mockCognitoAuth($this->user);
    }

    /**
     * user と partner を Couple で紐づけ、その Couple を返す（reset テスト用）
     */
    private function createCoupleForUserAndPartner(): Couple
    {
        $couple = Couple::create([
            'name' => $this->user->user_id.' & '.$this->partner->user_id,
        ]);
        $this->user->update(['couple_id' => $couple->id]);
        $this->partner->update(['couple_id' => $couple->id]);

        return $couple;
    }

    /**
     * 正常系 - entry：ユーザー名のみ更新できることを確認
     */
    public function test_entry_updates_user_name_only(): void
    {
        $newName = '新しい名前';

        $response = $this->postJson('/api/partner-setting', [
            'name' => $newName,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'ユーザー情報を保存しました',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => $newName,
        ]);
    }

    /**
     * 正常系 - entry：パートナーIDのみ設定できることを確認（Couple作成・双方のcouple_id更新）
     */
    public function test_entry_sets_partner_only_and_creates_couple(): void
    {
        $response = $this->postJson('/api/partner-setting', [
            'partner_id' => $this->partner->user_id,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'ユーザー情報を保存しました',
            ]);

        $this->assertDatabaseCount('couples', 1);

        $couple = Couple::first();
        $this->assertNotNull($couple);
        $this->assertStringContainsString($this->user->user_id, $couple->name);
        $this->assertStringContainsString($this->partner->user_id, $couple->name);

        $this->user->refresh();
        $this->partner->refresh();
        $this->assertSame($couple->id, $this->user->couple_id);
        $this->assertSame($couple->id, $this->partner->couple_id);
    }

    /**
     * 正常系 - entry：ユーザー名とパートナーIDを同時に設定できることを確認
     */
    public function test_entry_updates_name_and_sets_partner_together(): void
    {
        $newName = '設定後ユーザー名';

        $response = $this->postJson('/api/partner-setting', [
            'name' => $newName,
            'partner_id' => $this->partner->user_id,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'ユーザー情報を保存しました',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => $newName,
        ]);

        $this->assertDatabaseCount('couples', 1);
        $couple = Couple::first();
        $this->user->refresh();
        $this->partner->refresh();
        $this->assertSame($couple->id, $this->user->couple_id);
        $this->assertSame($couple->id, $this->partner->couple_id);
    }

    /**
     * 異常系 - entry：ユーザー名が10文字を超える場合に422を返す
     */
    public function test_entry_returns_422_when_name_exceeds_10_characters(): void
    {
        $response = $this->postJson('/api/partner-setting', [
            'name' => 'abcde123456',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'status' => false,
                'message' => 'ユーザー名は10文字以内で入力してください',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => $this->user->name,
        ]);
    }

    /**
     * 異常系 - entry：存在しないpartner_idを指定した場合に404を返す
     */
    public function test_entry_returns_404_when_partner_id_does_not_exist(): void
    {
        $response = $this->postJson('/api/partner-setting', [
            'partner_id' => 'non-existent-user-id',
        ]);

        $response->assertStatus(404)
            ->assertJson([
                'status' => false,
                'message' => '入力されたIDのユーザーが見つかりません',
            ]);

        $this->assertDatabaseCount('couples', 0);
        $this->assertNull($this->user->fresh()->couple_id);
    }

    /**
     * 異常系 - entry：自分自身のuser_idをpartner_idに指定した場合に404を返す
     */
    public function test_entry_returns_404_when_partner_id_is_self(): void
    {
        $response = $this->postJson('/api/partner-setting', [
            'partner_id' => $this->user->user_id,
        ]);

        $response->assertStatus(404)
            ->assertJson([
                'status' => false,
                'message' => '入力されたIDのユーザーが見つかりません',
            ]);

        $this->assertDatabaseCount('couples', 0);
        $this->assertNull($this->user->fresh()->couple_id);
    }

    /**
     * 正常系 - reset：パートナー解除が成功し、双方のcouple_idがnullになりCoupleレコードが削除される
     */
    public function test_reset_succeeds_and_clears_both_users_couple_id(): void
    {
        $couple = $this->createCoupleForUserAndPartner();

        $response = $this->deleteJson('/api/partner-setting/reset');

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'パートナーを解除しました',
            ]);

        $this->user->refresh();
        $this->partner->refresh();
        $this->assertNull($this->user->couple_id);
        $this->assertNull($this->partner->couple_id);

        $this->assertDatabaseMissing('couples', ['id' => $couple->id]);
    }

    /**
     * 正常系 - reset：Couple削除時に外部キーCASCADEでSubscription/Payment/Budgetの関連レコードが削除される
     */
    public function test_reset_cascades_deletion_to_related_subscription_payment_budget(): void
    {
        $couple = $this->createCoupleForUserAndPartner();

        $subscription = Subscription::create([
            'recorded_by_user_id' => $this->user->id,
            'couple_id' => $couple->id,
            'service_name' => 'テストサブスク',
            'amount' => 980,
            'billing_interval' => 'monthly',
            'start_date' => '2025-01-01',
            'finish_date' => '2025-12-31',
        ]);

        $categoryId = Category::first()->id;
        $payment = Payment::create([
            'category_id' => $categoryId,
            'paid_by_user_id' => $this->user->id,
            'recorded_by_user_id' => $this->user->id,
            'couple_id' => $couple->id,
            'payment_date' => now()->format('Y-m-d'),
            'amount' => 1000,
        ]);

        $budget = Budget::create([
            'couple_id' => $couple->id,
            'recorded_by_user_id' => $this->user->id,
            'category_id' => $categoryId,
            'period' => 1,
            'period_type' => 'monthly',
            'amount' => 5000,
        ]);

        $response = $this->deleteJson('/api/partner-setting/reset');

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'パートナーを解除しました',
            ]);

        $this->assertDatabaseMissing('couples', ['id' => $couple->id]);
        $this->assertDatabaseMissing('subscriptions', ['id' => $subscription->id]);
        $this->assertDatabaseMissing('payments', ['id' => $payment->id]);
        $this->assertDatabaseMissing('budgets', ['id' => $budget->id]);
    }
}
