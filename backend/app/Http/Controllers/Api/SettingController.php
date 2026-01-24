<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Couple;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SettingController extends Controller
{
    /*
     *
     */
    public function entry(Request $request): JsonResponse
    {
        $user = $request->attributes->get('auth_user');

        if (! $user) {
            Log::error('ユーザーが見つかりません');

            return response()->json([
                'status' => false,
                'message' => '認証エラーによりユーザーが取得できませんでした',
            ], 401);
        }

        // リクエストボディからデータを取得
        $userName = $request->input('name');
        $partnerId = $request->input('partner_id');

        // ユーザー名を更新
        if ($userName !== null && $userName !== '') {
            try {
                if (mb_strlen($userName) > 10) {
                    return response()->json([
                        'status' => false,
                        'message' => 'ユーザー名は10文字以内で入力してください',
                    ], 422);
                }

                $user->update(['name' => $userName]);
            } catch (Exception $e) {
                Log::error('ユーザー名の更新に失敗しました', [
                    'user_id' => $user->id,
                    'user_name' => $userName,
                    'error' => $e->getMessage(),
                ]);

                return response()->json([
                    'status' => false,
                    'message' => 'ユーザー名の更新に失敗しました',
                ], 500);
            }
        }

        // パートナーを設定
        if ($user->couple_id === null && $partnerId !== null) {
            try {
                $partner = User::where('user_id', $partnerId)->first();

                if (! $partner || $user->id === $partner->id) {
                    Log::error('パートナーが見つかりません', [
                        'partner_found' => $partner ? 'yes' : 'no',
                        'same_user' => $partner && $user->id === $partner->id,
                    ]);

                    return response()->json([
                        'status' => false,
                        'message' => '入力されたIDのユーザーが見つかりません',
                    ], 404);
                }

                $result = User::setPartner($user, $partner);

                if (! $result) {
                    return response()->json([
                        'status' => false,
                        'message' => 'パートナー設定に失敗しました',
                    ], 500);
                }
            } catch (Exception $e) {
                Log::error('パートナー設定に失敗しました', [
                    'user_id' => $user->id,
                    'partner_id' => $partnerId,
                    'error' => $e->getMessage(),
                ]);

                return response()->json([
                    'status' => false,
                    'message' => 'パートナー設定に失敗しました',
                ], 500);
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'ユーザー情報を保存しました',
        ]);
    }

    public function reset(Request $request): JsonResponse
    {
        $user = $request->attributes->get('auth_user');
        $coupleId = $user->couple_id;
        $partner = User::where('couple_id', $coupleId)
            ->where('id', '!=', $user->id)
            ->first();

        if (! $partner) {
            return response()->json([
                'status' => false,
                'message' => 'パートナーが見つかりません',
            ], 404);
        }

        try {
            DB::beginTransaction();

            $user->update([
                'couple_id' => null,
            ]);

            $partner->update([
                'couple_id' => null,
            ]);

            Couple::where('id', $coupleId)->delete();

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'パートナーを解除しました',
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('パートナーの解除に失敗しました', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
                'couple_id' => $coupleId,
            ]);

            return response()->json([
                'status' => false,
                'message' => 'パートナーの解除に失敗しました',
            ], 500);
        }
    }
}
