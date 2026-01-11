<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
    public function store(Request $request, $userMode): JsonResponse
    {
        $user = $request->attributes->get('auth_user');
        $user_id = $user->id;

        if ($userMode === 'common') {
            $couple_id = $user->couple_id;
        } else {
            $couple_id = null;
        }

        // payerが存在するか確認
        $payerExists = User::where('id', $request->payer)
            ->orWhere('couple_id', $request->payer)
            ->exists();

        if (! $payerExists) {
            return response()->json([
                'status' => false,
                'message' => '支払者が存在しません',
            ], 422);
        }

        // バリデーションチェック
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
            'category' => 'required|integer|exists:categories,id',
            'date' => 'required|date',
            'payer' => 'required|string',
            'shop_name' => 'nullable|string|max:255',
            'memo' => 'nullable|string|max:255',
        ], [
            'amount.required' => '金額は必須です',
            'amount.numeric' => '金額は数値で入力してください',
            'amount.min' => '金額は0以上で入力してください',
            'category.required' => 'カテゴリーは必須です',
            'date.required' => '日付は必須です',
            'date.date' => '日付は日付形式で入力してください',
            'payer.required' => '支払者は必須です',
            'shop_name.string' => 'お店の名前は文字列で入力してください',
            'shop_name.max' => 'お店の名前は255文字以内で入力してください',
            'memo.string' => 'メモは文字列で入力してください',
            'memo.max' => 'メモは255文字以内で入力してください',
        ]);

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

        $payment = Payment::newPaymentRecord($validator->validated(), $user_id, $couple_id);

        if (! $payment) {
            return response()->json([
                'status' => false,
                'message' => 'Transaction creation failed',
            ], 500);
        }

        return response()->json([
            'status' => true,
            'message' => 'Transaction created successfully',
        ]);
    }

    public function update(Request $request, $userMode, $id): JsonResponse
    {
        $user = $request->attributes->get('auth_user');
        $user_id = $user->id;

        if ($userMode === 'common') {
            $couple_id = $user->couple_id;
        } else {
            $couple_id = null;
        }

        // payerが存在するか確認
        $payerExists = User::where('id', $request->payer)
            ->orWhere('couple_id', $request->payer)
            ->exists();

        if (! $payerExists) {
            return response()->json([
                'status' => false,
                'message' => '支払者が存在しません',
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
            'category' => 'required|integer|exists:categories,id',
            'date' => 'required|date',
            'payer' => 'required|string',
            'shop_name' => 'nullable|string|max:255',
            'memo' => 'nullable|string|max:255',
        ], [
            'amount.required' => '金額は必須です',
            'amount.numeric' => '金額は数値で入力してください',
            'amount.min' => '金額は0以上で入力してください',
            'category.required' => 'カテゴリーは必須です',
            'date.required' => '日付は必須です',
            'date.date' => '日付は日付形式で入力してください',
            'payer.required' => '支払者は必須です',
            'payer.string' => '支払者は文字列で入力してください',
            'shop_name.string' => 'お店の名前は文字列で入力してください',
            'shop_name.max' => 'お店の名前は255文字以内で入力してください',
            'memo.string' => 'メモは文字列で入力してください',
            'memo.max' => 'メモは255文字以内で入力してください',
        ]);

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

        $updatePayment = Payment::updatePaymentRecord($validator, $id, $user_id, $userMode);
        if (! $updatePayment) {
            return response()->json([
                'status' => false,
                'message' => '対象の明細が見つかりませんでした',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Transaction updated successfully',
        ]);
    }

    public function delete(Request $request, $userMode, $id): JsonResponse
    {
        $user = $request->attributes->get('auth_user');
        $user_id = $user->id;

        if ($userMode === 'common') {
            $couple_id = $user->couple_id;
        } else {
            $couple_id = null;
        }

        $query = Payment::where('id', $id);

        if ($userMode === 'common') {
            // 共有モード
            $query->where('couple_id', $couple_id);
        } else {
            // 個人モード
            $query->where('recorded_by_user_id', $user_id)
                ->whereNull('couple_id');
        }

        $payment = $query->first();

        if (! $payment) {
            return response()->json([
                'status' => false,
                'message' => '対象の明細が見つかりませんでした',
            ], 404);
        }

        $payment->delete();

        return response()->json([
            'status' => true,
            'message' => 'Transaction deleted successfully',
        ]);
    }
}
