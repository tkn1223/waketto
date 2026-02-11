<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Category;
use App\Models\Couple;
use App\Models\Payment;
use App\Models\User;
use Database\Seeders\CategoryGroupsTableSeeder;
use Database\Seeders\CategoriesSeeder;
use Tests\Common\MocksCognitoAuth;
use Tests\TestCase;

class TransactionControllerTest extends TestCase
{
    use RefreshDatabase;
    use MocksCognitoAuth;

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
            'name' => $this->user->user_id . ' & ' . $this->partner->user_id,
        ]);

        $this->user->update(['couple_id' => $this->couple->id]);
        $this->partner->update(['couple_id' => $this->couple->id]);

        $this->mockCognitoAuth($this->user);
    }


    /**
     * 個人モードで支払い明細を作成できることを確認（正常系）
     */
    public function test_create_transaction_in_alone_mode(): void
    {
        $categoryId = Category::first()->id;
        $date = now()->format('Y-m-d');
        $requestBody = [
            'amount' => 1500,
            'category' => $categoryId,
            'date' => $date,
            'payer' => (string) $this->user->id,
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
            'paid_by_user_id' => $this->user->id,
            'recorded_by_user_id' => $this->user->id,
            'couple_id' => null,
            'payment_date' => $date,
            'amount' => 1500,
            'store_name' => 'ABCDショップ',
            'note' => 'テストメモ',
        ]);

        $this->assertSame(1, Payment::where('recorded_by_user_id', $this->user->id)->whereNull('couple_id')->count());
    }

    /**
     * 共有モードで支払い明細を作成できることを確認（正常系）
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
}