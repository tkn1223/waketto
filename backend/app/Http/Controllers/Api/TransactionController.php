<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

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
        $payerExists = User::where('user_id', $request->payer)
                        ->orWhere('couple_id', $request->payer)
                        ->exists();

        if (!$payerExists) {
            return response()->json([
                'status' => false,
                'message' => '支払者が存在しません',
            ], 422);
        };

        // バリデーションチェック
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
            'category' => 'required|integer|exists:categories,id',
            'date' => 'required|date',
            'payer' => 'required|string',
            'shop_name'=> 'nullable|string|max:255',
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
                'request_data' => $request->all()
            ]);
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        };

        $payment = Payment::newPaymentRecord($validator->validated(), $user_id, $couple_id);
        
        if (!$payment) {
            return response()->json([
                'status' => false,
                'message' => 'Transaction creation failed'
            ], 500);
        }

        return response()->json([
            'status' => true,
            'message' => 'Transaction created successfully'
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
            'category' => 'required|integer|exists:categories,id',
            'date' => 'required|date',
            'payer' => 'required|integer|exists:users,id',
            'shop_name'=> 'nullable|string|max:255',
            'memo' => 'nullable|string|max:255',
        ], [
            'amount.required' => '金額は必須です',
            'amount.numeric' => '金額は数値で入力してください',
            'amount.min' => '金額は0以上で入力してください',
            'category.required' => 'カテゴリーは必須です',
            'date.required' => '日付は必須です',
            'date.date' => '日付は日付形式で入力してください',
            'payer.required' => '支払者は必須です',
            'payer.exists' => '支払者は存在しません',
            'shop_name.string' => 'お店の名前は文字列で入力してください',
            'shop_name.max' => 'お店の名前は255文字以内で入力してください',
            'memo.string' => 'メモは文字列で入力してください',
            'memo.max' => 'メモは255文字以内で入力してください',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', [
                'errors' => $validator->errors(),
                'request_data' => $request->all()
            ]);
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        };

        $updatePayment = Payment::updatePaymentRecord($validator, $id);
        if (!$updatePayment) {
            return response()->json([
                'status' => false,
                'message' => 'Transaction update failed'
            ], 500);
        }

        return response()->json([
            'status' => true,
            'message' => 'Transaction updated successfully'
        ]);
    }

    public function delete($id): JsonResponse
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json([
                'status' => false,
                'message' => 'Transaction not found'
            ], 500);
        }

        $payment->delete();

        return response()->json([
            'status' => true,
            'message' => 'Transaction deleted successfully'
        ]);
    }
}
