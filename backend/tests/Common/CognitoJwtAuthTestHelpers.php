<?php

namespace Tests\Common;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Http;

trait CognitoJwtAuthTestHelpers
{
    // テスト用のkidを指定
    private static string $testKid = 'test-kid-res256';

    // テスト用RSA秘密鍵
    private static ?string $testPrivateKeyPem = null;

    // テスト用のJWKS
    private static ?array $testJwks = null;

    /**
     * テスト用の RSA 鍵ペアと JWKS を生成する
     */
    private function getTestKeyPairAndJwks(): array
    {
        if (self::$testPrivateKeyPem !== null && self::$testJwks !== null) {
            return [
                'private_key' => self::$testPrivateKeyPem,
                'jwks' => self::$testJwks,
            ];
        }

        $config = [
            'private_key_bits' => 2048,
            'private_key_type' => OPENSSL_KEYTYPE_RSA,
        ];
        $keyResource = openssl_pkey_new($config);
        if ($keyResource === false) {
            $this->fail('OpenSSL: 秘密鍵の生成に失敗しました');
        }

        openssl_pkey_export($keyResource, self::$testPrivateKeyPem);

        $details = openssl_pkey_get_details($keyResource);
        if ($details === false || ! isset($details['rsa']['n'], $details['rsa']['e'])) {
            $this->fail('OpenSSL: 公開鍵の取得に失敗しました');
        }

        $n = $this->base64UrlEncode($details['rsa']['n']);
        $e = $this->base64UrlEncode($details['rsa']['e']);

        self::$testJwks = [
            'keys' => [
                [
                    'kty' => 'RSA',
                    'kid' => self::$testKid,
                    'use' => 'sig',
                    'alg' => 'RS256',
                    'n' => $n,
                    'e' => $e,
                ],
            ],
        ];

        return [
            'private_key' => self::$testPrivateKeyPem,
            'jwks' => self::$testJwks,
        ];
    }

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * テスト用の有効な JWT を発行する（sub / exp を指定可能）
     */
    private function createValidTestJwt(string $sub = 'test-cognito-sub-001', ?int $exp = null): string
    {
        $exp = $exp ?? time() + 3600;
        $payload = [
            'sub' => $sub,
            'exp' => $exp,
            'iat' => time(),
            'iss' => 'https://cognito-idp.ap-northeast-1.amazonaws.com/test-pool-id',
        ];

        $keyAndJwks = $this->getTestKeyPairAndJwks();

        return JWT::encode(
            $payload,
            $keyAndJwks['private_key'],
            'RS256',
            self::$testKid
        );
    }

    /**
     * 期限切れのテスト用 JWT を発行する
     */
    private function createExpiredTestJwt(string $sub = 'test-cognito-sub-expired'): string
    {
        return $this->createValidTestJwt($sub, time() - 60);
    }

    /**
     * JWKS エンドポイントを偽装し、テスト用の公開鍵を返すようにする
     */
    private function fakeJwksEndpoint(): void
    {
        $keyAndJwks = $this->getTestKeyPairAndJwks();

        Http::fake([
            'cognito-idp.*.amazonaws.com/*/.well-known/jwks.json' => Http::response($keyAndJwks['jwks'], 200),
        ]);
    }
}