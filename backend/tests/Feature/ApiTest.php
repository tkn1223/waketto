<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class ApiTest extends TestCase
{
    /**
     * ヘルスチェックAPIのテスト
     */
    public function test_health_api_return_success(): void
    {
        $response = $this->get('/api/health');
        $response->assertStatus(200);
    }

    /**
     * APIのテスト
     */
    public function test_api_return_success(): void
    {
        $user = User::factory()->create();
        $this->withoutMiddleware();
        $this->app['request']->attributes->set('auth_user', $user);

        $categoriesResponse = $this->get('/api/categories');
        $categoriesResponse->assertStatus(200);
    }

    /**
     * 認証が必要なAPIのテスト（認証なし）
     */
    public function test_user_api_return_401(): void
    {
        $response = $this->get('/api/user');
        $response->assertStatus(401);
        $response->assertJson([
            'error' => 'Unauthorized',
            'message' => '認証トークンが見つかりません',
        ]);
    }
}