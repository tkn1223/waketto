<?php

namespace Tests\Feature\Middleware;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Common\CognitoJwtAuthTestHelpers;
use Tests\TestCase;

class CognitoJwtAuthTest extends TestCase
{
    use CognitoJwtAuthTestHelpers;
    use RefreshDatabase;

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
        return '/api/user';
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

    /*
     * 正常系 - ユーザー作成が正常に行われることを確認
     */
    public function test_can_create_user_and_returns_success_response(): void
    {
        $this->fakeJwksEndpoint();
        $token = $this->createValidTestJwt('new-user-sub-002');

        $response = $this->withHeaders(['Authorization' => 'Bearer '.$token])->get($this->getProtectedUrl());

        $response->assertStatus(200);

        $user = User::where('cognito_sub', 'new-user-sub-002')->first();
        $this->assertNotNull($user);
        $this->assertNotEmpty($user->user_id);
        $this->assertNotEmpty($user->name);
    }

    /*
     * 正常系 - ユーザー取得が正常に行われることを確認
     */
    public function test_can_get_user_info_and_returns_success_response(): void
    {
        $this->fakeJwksEndpoint();
        $token = $this->createValidTestJwt('new-user-sub-003');

        $existingUser = User::factory()->create([
            'cognito_sub' => 'new-user-sub-003',
            'user_id' => 'userid0003',   // users.user_id は 10 文字制限
            'name' => 'user003',         // users.name は 10 文字制限
        ]);

        $response = $this->withHeaders(['Authorization' => 'Bearer '.$token])->getJson($this->getProtectedUrl());

        $response->assertStatus(200);

        $data = $response->json();
        $this->assertSame($existingUser->id, $data['id']);
        $this->assertSame($existingUser->user_id, $data['user_id']);
        $this->assertSame($existingUser->name, $data['name']);
    }

    /*
     * 異常系 - トークンがない場合は401エラーを返すことを確認
     */
    public function test_returns_401_when_no_authorization_header(): void
    {
        $response = $this->getJson($this->getProtectedUrl());

        $response->assertStatus(401)
            ->assertJson([
                'error' => 'Unauthorized',
                'message' => '認証トークンが見つかりません',
            ]);
    }

    public function test_returns_401_when_authorization_header_is_empty(): void
    {
        $response = $this->withHeaders(['Authorization' => ''])->getJson($this->getProtectedUrl());

        $response->assertStatus(401)
            ->assertJson([
                'error' => 'Unauthorized',
                'message' => '認証トークンが見つかりません',
            ]);
    }

    public function test_returns_401_when_authorization_is_not_bearer(): void
    {
        $response = $this->withHeaders(['Authorization' => 'Bearer ***'])->getJson($this->getProtectedUrl());

        $response->assertStatus(401)
            ->assertJson([
                'error' => 'Unauthorized',
                'message' => '無効な認証トークンです',
            ]);
    }

    /*
     * 異常系 - kidが存在しない場合は401エラーを返すことを確認
     */
    public function test_returns_401_when_kid_is_not_found(): void
    {
        // kid なしのヘッダー: {"alg":"RS256"} のみ
        $header = $this->base64UrlEncode(json_encode(['alg' => 'RS256']));
        $payload = $this->base64UrlEncode(json_encode(['sub' => 'x', 'exp' => time() + 3600]));
        $signature = $this->base64UrlEncode('dummy-signature');
        $token = "{$header}.{$payload}.{$signature}";

        $response = $this->withHeaders(['Authorization' => 'Bearer '.$token])->getJson($this->getProtectedUrl());

        $response->assertStatus(401)
            ->assertJson([
                'error' => 'Unauthorized',
                'message' => '無効な認証トークンです',
            ]);
    }

    /*
     * 異常系 - 期限切れのトークンが401エラーを返すことを確認
     */
    public function test_returns_401_when_token_is_expired(): void
    {
        $this->fakeJwksEndpoint();
        $token = $this->createValidTestJwt('expired-user-sub-004', time() - 60);

        $response = $this->withHeaders(['Authorization' => 'Bearer '.$token])->getJson($this->getProtectedUrl());

        $response->assertStatus(401)
            ->assertJson([
                'error' => 'Unauthorized',
                'message' => '無効な認証トークンです',
            ]);
    }

    /*
     * 異常系 - 不正な署名のトークンが401エラーを返すことを確認
     */
    public function test_returns_401_when_signature_is_invalid(): void
    {
        $this->fakeJwksEndpoint();
        $validToken = $this->createValidTestJwt();
        // 署名部分だけ別の文字列に差し替える
        $parts = explode('.', $validToken);
        $parts[2] = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode('invalid-signature-bytes'));
        $tamperedToken = implode('.', $parts);

        $response = $this->withHeaders(['Authorization' => 'Bearer '.$tamperedToken])->getJson($this->getProtectedUrl());

        $response->assertStatus(401)
            ->assertJson([
                'error' => 'Unauthorized',
                'message' => '無効な認証トークンです',
            ]);
    }
}
