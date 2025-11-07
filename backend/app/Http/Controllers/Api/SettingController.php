<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function entry(Request $request, $partnerId): JsonResponse
    {
        $user = $request->attributes->get('auth_user');

        if ($user->couple_id) {
            return response()->json([
                'status' => false,
                'message' => 'すでにパートナーが設定されています',
            ]);
        }

        $partner = User::where('user_id', $partnerId)->first();

        if (! $partner || $user->id === $partner->id) {
            return response()->json([
                'status' => false,
                'message' => '入力されたIDのユーザーが見つかりません',
            ]);
        }

        if (! User::setPartner($user, $partner)) {
            return response()->json([
                'status' => false,
                'message' => 'パートナー設定に失敗しました',
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'パートナー設定を保存しました',
        ]);
    }
}
