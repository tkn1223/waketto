<?php

namespace Tests\Feature\Middleware;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Common\CognitoJwtAuthTestHelpers;
use Tests\TestCase;

class CognitoJwtAuthTest extends TestCase
{
    use RefreshDatabase;
    use CognitoJwtAuthTestHelpers;

    private const TEST_USER_POOL_ID = 'ap-northeast-1_test-pool-id';
    private const TEST_REGION = 'ap-northeast-1';

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.cognito.user_pool_id' => self::TEST_USER_POOL_ID,
            'services.cognito.region' => self::TEST_REGION,
        ]);
    }

    // 認証必須のエンドポイントとして /api/health を使用
    private function getProtectedUrl(): string
    {
        return '/api/categories';
    }

    /*
     * 正常系 - 有効なJWTトークンが正常に認証されることを確認
     */
    public function test_authenticated_successfully_with_valid_token(): void
    {
        $this->fakeJwksEndpoint();
        $token = $this->createValidTestJwt('new-user-sub-001');

        $response = $this->withHeaders(['Authorization' => 'Bearer '.$token])->get($this->getProtectedUrl());

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', ['cognito_sub' => 'new-user-sub-001']);
    }
}