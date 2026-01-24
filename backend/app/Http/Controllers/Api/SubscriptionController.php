<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class SubscriptionController extends Controller
{
    /**
     * サブスクリプションデータを取得する
     *
     * @param  Request  $request  リクエストオブジェクト（queryパラメータ: なし）
     * @param  string  $userMode  ユーザーモード（個人/共有）
     */
    public function getSubscriptions(Request $request, $userMode): JsonResponse
    {
        $user = $request->attributes->get('auth_user');
        $userId = $user->id;

        if ($userMode === 'common') {
            $couple_id = $user->couple_id;
        } else {
            $couple_id = null;
        }

        try {
            // サブスクリプションの取得
            $subscriptionQuery = Subscription::where('recorded_by_user_id', $userId);
            if ($couple_id) {
                $subscriptionQuery->where('couple_id', $couple_id);
            } else {
                $subscriptionQuery->whereNull('couple_id');
            }
            $subscriptions = $subscriptionQuery->orderBy('created_at', 'asc')->get();

            // フロントエンド用の形式に変換
            $formattedSubscriptions = $subscriptions->map(function ($subscription) {
                return [
                    'id' => (string) $subscription->id,
                    'name' => $subscription->service_name,
                    'updatePeriod' => $subscription->billing_interval,
                    'amount' => $subscription->amount,
                    'startDate' => $subscription->start_date ? $subscription->start_date->format('Y-m-d') : null,
                    'finishDate' => $subscription->finish_date ? $subscription->finish_date->format('Y-m-d') : null,
                ];
            });

            return response()->json([
                'status' => true,
                'data' => $formattedSubscriptions,
            ]);
        } catch (\Exception $e) {
            Log::error('サブスクリプションの取得に失敗しました', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $userId,
                'couple_id' => $couple_id,
            ]);

            return response()->json([
                'status' => false,
                'message' => 'サブスクリプションの取得に失敗しました',
            ], 500);
        }
    }

    /**
     * サブスクリプションデータを更新する
     *
     * 既存のサブスクリプションを削除し、新しいサブスクリプションを作成する。
     *
     * @param  Request  $request  リクエストオブジェクト（bodyパラメータ: subscriptions=サブスクリプションデータ）
     * @param  string  $userMode  ユーザーモード（個人/共有）
     */
    public function updateSubscriptions(Request $request, $userMode): JsonResponse
    {
        // バリデーションチェック
        $validator = Validator::make($request->all(), [
            'subscriptions' => 'required|array',
            'subscriptions.*.name' => 'required|string|max:255',
            'subscriptions.*.updatePeriod' => 'required|string|in:monthly,yearly',
            'subscriptions.*.amount' => 'required|numeric|min:1',
            'subscriptions.*.startDate' => 'required|date',
            'subscriptions.*.finishDate' => 'required|date',
        ], [
            'subscriptions.required' => 'サブスクリプションデータは必須です',
            'subscriptions.array' => 'データが読み込めません。リロードしてください。',
            'subscriptions.*.name.required' => 'サービス名は必須です',
            'subscriptions.*.name.string' => 'サービス名は文字列で入力してください',
            'subscriptions.*.name.max' => 'サービス名は255文字以内で入力してください',
            'subscriptions.*.updatePeriod.required' => '更新間隔は必須です',
            'subscriptions.*.updatePeriod.in' => '更新間隔は「カ月」または「年」を選択してください',
            'subscriptions.*.amount.required' => '金額は必須です',
            'subscriptions.*.amount.numeric' => '金額は数値で入力してください',
            'subscriptions.*.amount.min' => '金額は1円以上で入力してください',
            'subscriptions.*.startDate.date' => '開始日は有効な日付形式で入力してください',
            'subscriptions.*.startDate.required' => '開始日は必須です',
            'subscriptions.*.finishDate.date' => '終了日は有効な日付形式で入力してください',
            'subscriptions.*.finishDate.required' => '終了日は必須です',
        ]);

        // 終了日が開始日以降であることを確認
        $validator->after(function ($validator) use ($request) {
            $subscriptions = $request->input('subscriptions', []);
            foreach ($subscriptions as $index => $subscription) {
                $startDate = $subscription['startDate'] ?? null;
                $finishDate = $subscription['finishDate'] ?? null;

                if ($startDate && $finishDate && $finishDate < $startDate) {
                    $validator->errors()->add(
                        "subscriptions.{$index}.finishDate",
                        '終了日は開始日以降の日付を入力してください'
                    );
                }
            }
        });

        if ($validator->fails()) {
            Log::error('Validation failed', [
                'errors' => $validator->errors(),
                'request_data' => $request->all(),
            ]);

            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->attributes->get('auth_user');
        $userId = $user->id;

        if ($userMode === 'common') {
            $couple_id = $user->couple_id;
        } else {
            $couple_id = null;
        }

        // サブスクリプションデータを取得
        $subscriptions = $request->input('subscriptions');

        if (! is_array($subscriptions)) {
            Log::error('渡されたサブスクリプションデータが不正です', [
                'subscriptions' => $subscriptions,
                'request_all' => $request->all(),
            ]);

            return response()->json([
                'status' => false,
                'message' => '渡されたサブスクリプションデータが不正です',
            ], 422);
        }

        try {
            DB::beginTransaction();

            // 既存のサブスクリプションを削除
            $subscriptionQuery = Subscription::where('recorded_by_user_id', $userId);
            if ($couple_id) {
                $subscriptionQuery->where('couple_id', $couple_id);
            } else {
                $subscriptionQuery->whereNull('couple_id');
            }
            $subscriptionQuery->delete();

            // 新しいサブスクリプションを作成
            foreach ($subscriptions as $subscriptionData) {
                Subscription::create([
                    'recorded_by_user_id' => $userId,
                    'couple_id' => $couple_id,
                    'service_name' => $subscriptionData['name'],
                    'amount' => (int) $subscriptionData['amount'],
                    'billing_interval' => $subscriptionData['updatePeriod'],
                    'start_date' => $subscriptionData['startDate'] ?? null,
                    'finish_date' => $subscriptionData['finishDate'] ?? null,
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'サブスクリプションの設定に成功しました',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('サブスクリプションの保存に失敗しました', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $userId,
                'couple_id' => $couple_id,
            ]);

            return response()->json([
                'status' => false,
                'message' => 'サブスクリプションの保存に失敗しました',
            ], 500);
        }
    }
}
