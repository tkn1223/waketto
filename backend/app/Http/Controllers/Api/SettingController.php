<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Couple;
use App\Models\Budget;
use App\Models\Payment;
use App\Models\Subscription;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class SettingController extends Controller
{
    public function entry(Request $request, $userName, $partnerId = null): JsonResponse
    {
        $user = $request->attributes->get('auth_user');

        // ユーザー名を更新
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

        // パートナーを設定
        if ($partnerId) {
            if ($user->couple_id) {
                return response()->json([
                    'status' => false,
                    'message' => 'すでにパートナーが設定されています',
                ], 400);
            }

            try {
                $partner = User::where('user_id', $partnerId)->first();

                if (! $partner || $user->id === $partner->id) {
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
                'pair_index' => null,
            ]);

            $partner->update([
                'couple_id' => null,
                'pair_index' => null,
            ]);

            Couple::where('id', $coupleId)->delete();

            Budget::where('couple_id', $coupleId)->delete();

            Payment::where('couple_id', $coupleId)->delete();

            Subscription::where('couple_id', $coupleId)->delete();

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
