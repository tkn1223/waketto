<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use App\Models\Couple;
use App\Models\Payment;
use App\Models\User;
use Database\Seeders\CategoriesSeeder;
use Database\Seeders\CategoryGroupsTableSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Common\MocksCognitoAuth;
use Tests\TestCase;

class TransactionControllerTest extends TestCase
{
    use MocksCognitoAuth;
    use RefreshDatabase;

    protected User $user;

    protected User $partner;

    protected Couple $couple;

    /**
     * テストデータの作成と認証の設定
     */
    protected function setUp(): void
    {
        parent::setUp();

        // category groupとcategoryをseederで作成
        $this->seed(CategoryGroupsTableSeeder::class);
        $this->seed(CategoriesSeeder::class);

        // userとpartnerを作成
        $this->user = User::factory()->create();
        $this->partner = User::factory()->create();

        // coupleを作成
        $this->couple = Couple::create([
            'name' => $this->user->user_id.' & '.$this->partner->user_id,
        ]);

        $this->user->update(['couple_id' => $this->couple->id]);
        $this->partner->update(['couple_id' => $this->couple->id]);

        $this->mockCognitoAuth($this->user);
    }

    /**
     * 正常系：個人モードで支払い明細を作成できることを確認
     */
    public function test_create_transaction_in_alone_mode(): void
    {
        $categoryId = Category::first()->id;
        $date = now()->format('Y-m-d');
        $userId = $this->user->id;

        $requestBody = [
            'amount' => 1500,
            'category' => $categoryId,
            'date' => $date,
            'payer' => (string) $userId,
            'shop_name' => 'ABCDショップ',
            'memo' => 'テストメモ',
        ];

        $response = $this->postJson('/api/transaction/alone', $requestBody);

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'Transaction created successfully',
            ]);

        $this->assertDatabaseHas('payments', [
            'category_id' => $categoryId,
            'paid_by_user_id' => $userId,
            'recorded_by_user_id' => $userId,
            'couple_id' => null,
            'payment_date' => $date,
            'amount' => 1500,
            'store_name' => 'ABCDショップ',
            'note' => 'テストメモ',
        ]);

        $this->assertSame(1, Payment::where('recorded_by_user_id', $this->user->id)->whereNull('couple_id')->count());
    }

    /**
     * 正常系：共有モードで支払い明細を作成できることを確認
     */
    public function test_create_transaction_in_common_mode(): void
    {
        $categoryId = Category::first()->id;
        $date = now()->format('Y-m-d');
        $requestBody = [
            'amount' => 1500,
            'category' => $categoryId,
            'date' => $date,
            'payer' => (string) $this->couple->id,
            'shop_name' => 'ABCDショップ',
            'memo' => 'テストメモ',
        ];

        $response = $this->postJson('/api/transaction/common', $requestBody);

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'Transaction created successfully',
            ]);

        $this->assertDatabaseHas('payments', [
            'category_id' => $categoryId,
            'paid_by_user_id' => $this->partner->id,
            'recorded_by_user_id' => $this->user->id,
            'couple_id' => $this->couple->id,
            'payment_date' => $date,
            'amount' => 1500,
            'store_name' => 'ABCDショップ',
            'note' => 'テストメモ',
        ]);

        $this->assertSame(1, Payment::where('couple_id', $this->couple->id)->count());
    }

    /*
     * 異常系：必須項目（amount）が欠けている場合に422とバリデーションエラーを返すことを確認
     */
    public function test_store_fails_when_required_field_missing(): void
    {
        $categoryId = Category::first()->id;
        $date = now()->format('Y-m-d');

        $requestBody = [
            'category' => $categoryId,
            'date' => $date,
            'payer' => (string) $this->couple->id,
            'shop_name' => 'ABCDショップ',
            'memo' => 'テストメモ',
        ];

        $response = $this->postJson('/api/transaction/alone', $requestBody);

        $response->assertStatus(422)
            ->assertJson([
                'status' => false,
            ])
            ->assertJsonPath('errors.amount.0', '金額は必須です');

        $this->assertDatabaseCount('payments', 0);
    }

    /*
     * 異常系：amountが負の数の場合に422とバリデーションエラーを返すことを確認
     */
    public function test_store_fails_when_amount_is_negative(): void
    {
        $categoryId = Category::first()->id;
        $date = now()->format('Y-m-d');

        $requestBody = [
            'amount' => -1000,
            'category' => $categoryId,
            'date' => $date,
            'payer' => (string) $this->couple->id,
            'shop_name' => 'ABCDショップ',
            'memo' => 'テストメモ',
        ];

        $response = $this->postJson('/api/transaction/alone', $requestBody);

        $response->assertStatus(422)
            ->assertJson([
                'status' => false,
            ])
            ->assertJsonPath('errors.amount.0', '金額は0以上で入力してください');

        $this->assertDatabaseCount('payments', 0);
    }

    /*
     * 異常系：categoryが存在しない場合に422とバリデーションエラーを返すことを確認
     */
    public function test_store_fails_when_category_does_not_exist(): void
    {
        $categoryId = Category::first()->id;
        $date = now()->format('Y-m-d');

        $requestBody = [
            'category' => 100,
            'date' => $date,
            'payer' => (string) $this->couple->id,
            'shop_name' => 'ABCDショップ',
            'memo' => 'テストメモ',
        ];

        $response = $this->postJson('/api/transaction/alone', $requestBody);

        $response->assertStatus(422)
            ->assertJson([
                'status' => false,
            ])
            ->assertJsonPath('errors.category.0', 'カテゴリーは存在しません');

        $this->assertDatabaseCount('payments', 0);
    }

    /**
     * 正常系：個人モードで支払い明細を更新できることを確認
     */
    public function test_update_transaction_in_alone_mode(): void
    {
        $categoryId = Category::first()->id;
        $date = now()->format('Y-m-d');
        $userId = $this->user->id;

        $payment = Payment::create([
            'category_id' => $categoryId,
            'paid_by_user_id' => $userId,
            'recorded_by_user_id' => $userId,
            'couple_id' => null,
            'payment_date' => $date,
            'amount' => 1500,
            'store_name' => 'ABCDショップ',
            'note' => 'テストメモ',
        ]);

        $paymentId = $payment->id;

        $requestBody = [
            'amount' => 2000,
            'category' => $categoryId,
            'date' => $date,
            'payer' => (string) $userId,
            'shop_name' => 'EFGHショップ',
            'memo' => '更新テストメモ',
        ];

        $response = $this->putJson("/api/transaction/alone/{$paymentId}", $requestBody);

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'Transaction updated successfully',
            ]);

        $this->assertDatabaseHas('payments', [
            'id' => $paymentId,
            'category_id' => $categoryId,
            'paid_by_user_id' => $userId,
            'recorded_by_user_id' => $userId,
            'couple_id' => null,
            'payment_date' => $date,
            'amount' => 2000,
            'store_name' => 'EFGHショップ',
            'note' => '更新テストメモ',
        ]);
    }

    /**
     * 正常系：共有モードで支払い明細を更新できることを確認
     */
    public function test_update_transaction_in_common_mode(): void
    {
        $categoryId = Category::first()->id;
        $date = now()->format('Y-m-d');

        $payment = Payment::create([
            'category_id' => $categoryId,
            'paid_by_user_id' => $this->partner->id,
            'recorded_by_user_id' => $this->user->id,
            'couple_id' => $this->couple->id,
            'payment_date' => $date,
            'amount' => 1500,
            'store_name' => 'ABCDショップ',
            'note' => 'テストメモ',
        ]);

        $paymentId = $payment->id;

        $requestBody = [
            'amount' => 2000,
            'category' => $categoryId,
            'date' => $date,
            'payer' => (string) $this->couple->id,
            'shop_name' => 'EFGHショップ',
            'memo' => '更新テストメモ',
        ];

        $response = $this->putJson("/api/transaction/common/{$paymentId}", $requestBody);

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'Transaction updated successfully',
            ]);

        $this->assertDatabaseHas('payments', [
            'id' => $paymentId,
            'category_id' => $categoryId,
            'paid_by_user_id' => $this->partner->id,
            'recorded_by_user_id' => $this->user->id,
            'couple_id' => $this->couple->id,
            'payment_date' => $date,
            'amount' => 2000,
            'store_name' => 'EFGHショップ',
            'note' => '更新テストメモ',
        ]);
    }

    /**
     * 異常系：個人モードで他人（パートナー）の明細を更新しようとすると404を返すことを確認
     */
    public function test_update_fails_when_updating_others_transaction_in_alone_mode(): void
    {
        $categoryId = Category::first()->id;
        $date = now()->format('Y-m-d');
        $partnerId = $this->partner->id;

        $payment = Payment::create([
            'category_id' => $categoryId,
            'paid_by_user_id' => $partnerId,
            'recorded_by_user_id' => $partnerId,
            'couple_id' => null,
            'payment_date' => $date,
            'amount' => 1500,
            'store_name' => 'ABCDショップ',
            'note' => '他のユーザーの明細',
        ]);

        $requestBody = [
            'amount' => 2000,
            'category' => $categoryId,
            'date' => $date,
            'payer' => (string) $this->user->id,
            'shop_name' => 'EFGHショップ',
            'memo' => '他ユーザーのデータを更新してみる',
        ];

        $response = $this->putJson("/api/transaction/alone/{$payment->id}", $requestBody);

        $response->assertStatus(404)
            ->assertJson([
                'status' => false,
                'message' => '対象の明細が見つかりませんでした',
            ]);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'amount' => 1500,
            'store_name' => 'ABCDショップ',
            'note' => '他のユーザーの明細',
        ]);
    }

    /**
     * 異常系：共有モードで別カップルの明細を更新しようとすると404を返すことを確認
     */
    public function test_update_fails_when_updating_other_couples_transaction_in_common_mode(): void
    {
        $otherUser = User::factory()->create();
        $otherPartner = User::factory()->create();
        $otherCouple = Couple::create([
            'name' => $otherUser->user_id.' & '.$otherPartner->user_id,
        ]);
        $otherUser->update(['couple_id' => $otherCouple->id]);
        $otherPartner->update(['couple_id' => $otherCouple->id]);

        $categoryId = Category::first()->id;
        $date = now()->format('Y-m-d');

        $payment = Payment::create([
            'category_id' => $categoryId,
            'paid_by_user_id' => $otherPartner->id,
            'recorded_by_user_id' => $otherUser->id,
            'couple_id' => $otherCouple->id,
            'payment_date' => $date,
            'amount' => 1500,
            'store_name' => '別カップルショップ',
            'note' => '別カップルの明細',
        ]);

        $requestBody = [
            'amount' => 2000,
            'category' => $categoryId,
            'date' => $date,
            'payer' => (string) $this->couple->id,
            'shop_name' => 'ABCDショップ',
            'memo' => '別カップルのデータを更新してみる',
        ];

        $response = $this->putJson("/api/transaction/common/{$payment->id}", $requestBody);

        $response->assertStatus(404)
            ->assertJson([
                'status' => false,
                'message' => '対象の明細が見つかりませんでした',
            ]);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'paid_by_user_id' => $otherPartner->id,
            'amount' => 1500,
            'store_name' => '別カップルショップ',
            'note' => '別カップルの明細',
        ]);
    }

    /**
     * 異常系：必須項目（amount）が欠けている場合に422とバリデーションエラーを返すことを確認
     */
    public function test_update_fails_when_required_fields_missing(): void
    {
        $categoryId = Category::first()->id;
        $date = now()->format('Y-m-d');

        $payment = Payment::create([
            'category_id' => $categoryId,
            'paid_by_user_id' => $this->user->id,
            'recorded_by_user_id' => $this->user->id,
            'couple_id' => null,
            'payment_date' => $date,
            'amount' => 1500,
            'store_name' => 'ABCDショップ',
            'note' => 'テストメモ',
        ]);

        $requestBody = [
            'category' => $categoryId,
            'date' => $date,
            'payer' => (string) $this->user->id,
            'shop_name' => 'EFGHショップ',
            'memo' => '更新テストメモ',
        ];

        $response = $this->putJson("/api/transaction/alone/{$payment->id}", $requestBody);

        $response->assertStatus(422)
            ->assertJson([
                'status' => false,
            ])
            ->assertJsonPath('errors.amount.0', '金額は必須です');

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'amount' => 1500,
        ]);
    }
}
