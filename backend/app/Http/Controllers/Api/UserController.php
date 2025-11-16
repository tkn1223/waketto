<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class UserController extends Controller
{
    /**
     * ユーザー情報を取得
     */
    public function getUserInfo(Request $request): JsonResponse
    {
        $user = $request->attributes->get('auth_user');

        // パートナーのuser_idを取得
        $partnerUserId = null;
        if ($user->couple_id) {
            $partnerUserId = User::getPartnerUserId($user);
        }

        return response()->json([
            'id' => $user->id,
            'user_id' => $user->user_id,
            'name' => $user->name,
            'couple_id' => $user->couple_id,
            'partner_user_id' => $partnerUserId
        ]);
    }

    /**
     * 認証済みユーザーのプロファイルを取得
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->attributes->get('auth_user');

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'cognito_sub' => $user->cognito_sub,
            ],
        ]);
    }

    /**
     * ユーザープロファイルの更新
     */
    public function updateProfile(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|email|max:255',
            ]);

            $user = $request->attributes->get('auth_user');
            $user->update($validated);

            return response()->json([
                'message' => 'プロファイルが更新されました',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'cognito_sub' => $user->cognito_sub,
                    'updated_at' => $user->updated_at,
                ],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'バリデーションエラーが発生しました',
                'errors' => $e->errors(),
            ], 422);
        }
    }
}
