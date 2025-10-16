<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Budget;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;

class BudgetUsageController extends Controller
{
    public function index(Request $request, $userMode): JsonResponse
    {
        $user = $request->attributes->get('auth_user');
        $userId = $user->id;

        if ($userMode === 'common') {
            $couple_id = $user->couple_id;
        } else {
            $couple_id = null;
        }

        try {
            // 予算の取得
            $budget = $this->getBudgetData($couple_id, $userId);
            // 実績の取得
            $paymentRecords = $this->getPaymentRecords($couple_id, $userId, $budget);
        } catch (\Exception $e) {
            Log::error('予算の取得に失敗しました', [
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'status' => false,
                'message' => '予算の取得に失敗しました',
            ], 500);
        }

        return response()->json([
            'status' => true,
            'data' => $budget,
            'payment_records' => $paymentRecords,
        ]);
    }

    private function getBudgetData($couple_id, $userId)
    {
        $query = Budget::with(['category:id,name,code'])
            ->select('id', 'amount', 'category_id');

        return $couple_id
        ? $query->where('couple_id', $couple_id)->get()
        : $query->where('recorded_by_user_id', $userId)
            ->whereNull('couple_id')
            ->get();
    }

    private function getPaymentRecords($couple_id, $userId, $budget)
    {
        $query = Payment::selectRaw('
                MONTH(payment_date) as month,
                category_id,
                SUM(amount) as amount,
                GROUP_CONCAT(id) as payment_ids
            ')
            ->whereIn('category_id', $budget->pluck('category_id'))
            ->groupBy('month', 'category_id');

        return $couple_id
        ? $query->where('couple_id', $couple_id)->get()
        : $query->where('recorded_by_user_id', $userId)
            ->whereNull('couple_id')
            ->get();
    }
}
