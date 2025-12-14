<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Couple;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SettingController extends Controller
{
    public function entry(Request $request): JsonResponse
    {
        Log::warning('[DEBUG] entry method 開始しました', [
            'request_data' => $request->all(),
        ]);

        $user = $request->attributes->get('auth_user');

        if (! $user) {
            Log::error('ユーザーが見つかりません');

            return response()->json([
                'status' => false,
                'message' => '認証エラー',
            ], 401);
        }

        // リクエストボディからデータを取得
        $userName = $request->input('name');
        $partnerId = $request->input('partner_id');

        Log::warning('[DEBUG] パラメータを取得しました', [
            'userName' => $userName,
            'partnerId' => $partnerId,
        ]);

        // ユーザー名を更新
        if ($userName !== null) {
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
        if ($partnerId) {
            Log::warning('[DEBUG] パートナー設定を開始しました', [
                'partner_id' => $partnerId,
                'user_couple_id' => $user->couple_id,
            ]);

            if ($user->couple_id) {
                Log::warning('[DEBUG] ユーザーはすでにパートナーが設定されています');

                return response()->json([
                    'status' => false,
                    'message' => 'すでにパートナーが設定されています',
                ], 400);
            }

            try {
                Log::warning('[DEBUG] パートナーを検索しました');
                $partner = User::where('user_id', $partnerId)->first();

                if (! $partner || $user->id === $partner->id) {
                    Log::warning('[DEBUG] パートナーが見つかりません', [
                        'partner_found' => $partner ? 'yes' : 'no',
                        'same_user' => $partner && $user->id === $partner->id,
                    ]);

                    return response()->json([
                        'status' => false,
                        'message' => '入力されたIDのユーザーが見つかりません',
                    ], 404);
                }

                Log::warning('[DEBUG] setPartnerを呼び出しました', [
                    'user_id' => $user->id,
                    'partner_id' => $partner->id,
                ]);

                $result = User::setPartner($user, $partner);

                Log::warning('[DEBUG] setPartnerの結果を取得しました', ['result' => $result]);

                if (! $result) {
                    Log::error('[DEBUG] setPartnerがfalseを返しました');

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
