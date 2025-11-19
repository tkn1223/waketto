<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CognitoJwtAuth
{
    /**
     * Cognito JWTによる認証
     *
     * リクエストヘッダーのJWTを検証し
     * 認証されたユーザー情報をリクエストに追加する
     *
     * @param  Request  $request  受信したHTTPリクエスト
     * @param Closure #next 次のミドルウェアまたはコントローラー
     * @return Response 成功時には次の処理へ、失敗時は401エラー
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Bearerトークンを取得
        $token = $this->getTokenFromRequest($request);

        if (! $token) {
            return $this->unauthorizedResponse('認証トークンが見つかりません');
        }

        try {
            // JWTを検証してユーザー情報を取得
            $user = $this->validateTokenAndGetUser($token);

            if (! $user) {
                return $this->unauthorizedResponse('無効な認証トークンです');
            }

            // リクエストにユーザー情報を追加
            $request->attributes->set('auth_user', $user);

            return $next($request);

        } catch (\Throwable $e) {
            Log::error('JWT認証エラー', [
                'error' => $e->getMessage(),
                'error_type' => get_class($e),
            ]);

            return $this->unauthorizedResponse('認証に失敗しました');
        }
    }

    /**
     * リクエストからBearerトークンを取得
     */
    private function getTokenFromRequest(Request $request): ?string
    {
        $header = $request->header('Authorization');

        if ($header && str_starts_with($header, 'Bearer ')) {
            return substr($header, 7);
        }

        return null;
    }

    /**
     * JWTを検証してユーザーを取得
     */
    private function validateTokenAndGetUser(string $token): ?User
    {
        try {
            // JWTのヘッダーからkidを取得
            $tokenParts = explode('.', $token);
            if (count($tokenParts) !== 3) {
                Log::error('無効なJWTトークン形式です', ['token_parts' => count($tokenParts)]);

                return null;
            }

            $header = JWT::jsonDecode(JWT::urlsafeB64Decode($tokenParts[0]));

            $kid = $header->kid;
            if (! $kid) {
                Log::error('JWTヘッダーにkidが存在しません', ['header' => $header]);

                return null;
            }

            // Cognitoの公開鍵を取得
            $publicKey = $this->getCognitoPublicKey($kid);

            // JWTの改ざん検証を行い、ペイロードを取得
            $payload = JWT::decode($token, $publicKey);

            if (isset($payload->exp) && $payload->exp < time()) {
                Log::error('JWTトークンの有効期限が切れています', [
                    'payload' => json_decode(json_encode($payload), true),
                    'current_time' => time(),
                    'exp' => $payload->exp,
                ]);

                return null;
            }

            // ユーザーを取得または作成
            return $this->getUserFromPayload($payload);

        } catch (\Throwable $e) {
            Log::error('JWT検証エラー', [
                'error' => $e->getMessage(),
                'error_type' => get_class($e),
            ]);

            return null;
        }
    }

    /**
     * Cognitoの公開鍵を取得
     */
    private function getCognitoPublicKey(string $kid): Key
    {
        $userPoolId = config('services.cognito.user_pool_id');
        $region = config('services.cognito.region');

        $jwksUrl = "https://cognito-idp.{$region}.amazonaws.com/{$userPoolId}/.well-known/jwks.json";

        try {
            $jwks = json_decode(file_get_contents($jwksUrl), true);
            // JWK形式の鍵をPHPの検証用キーリソースへ変換
            $keySet = JWK::parseKeySet($jwks);

            if (! isset($keySet[$kid])) {
                throw new \Exception('公開鍵が見つかりません: '.$kid);
            }

            return $keySet[$kid];
        } catch (\Exception $e) {
            Log::error('JWKS解析エラー', [
                'error' => $e->getMessage(),
                'error_type' => get_class($e),
            ]);
            throw new \Exception('公開鍵の取得に失敗しました: '.$e->getMessage());
        }
    }

    /**
     * JWTペイロードからユーザーを取得
     */
    private function getUserFromPayload(object $payload): ?User
    {
        $cognitoSub = $payload->sub;

        try {
            return User::findOrCreateByCognitoSub($cognitoSub);
        } catch (\Exception $e) {
            Log::error('ユーザー取得/作成エラー', [
                'error' => $e->getMessage(),
                'error_type' => get_class($e),
            ]);

            return null;
        }
    }

    /**
     * 認証失敗レスポンスを返す
     */
    private function unauthorizedResponse(string $message): JsonResponse
    {
        Log::error('認証失敗', ['message' => $message]);

        return response()->json([
            'error' => 'Unauthorized',
            'message' => $message,
        ], 401);
    }
}
