<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Category;
use App\Models\User;
use App\Models\Couple;
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
     * setUpで作成したユーザー・カップルが存在し、紐づいていることを確認
     */
    public function test_setup_creates_user_partner_and_couple(): void
    {
        $this->assertNotNull($this->user->id);
        $this->assertNotNull($this->partner->id);
        $this->assertNotNull($this->couple->id);
        $this->assertSame($this->couple->id, $this->user->couple_id);
        $this->assertSame($this->couple->id, $this->partner->couple_id);
    }

    /**
     * 認証をバイパスしてAPIに到達できることを確認（store を1件作成）
     */
    public function test_authenticated_request_reaches_api(): void
    {
        $categoryId = Category::first()->id;
        $response = $this->postJson('/api/transaction/alone', [
            'amount' => 100,
            'category' => $categoryId,
            'date' => now()->format('Y-m-d'),
            'payer' => (string) $this->user->id,
            'shop_name' => 'test shop',
            'memo' => 'setup check',
        ]);

        $response->assertStatus(200)
            ->assertJson(['status' => true]);
    }
}
