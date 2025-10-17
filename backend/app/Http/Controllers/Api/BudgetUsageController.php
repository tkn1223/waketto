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

        // クエリパラメータから年を取得
        $year = $request->query('year', date('Y'));
        
        // 年度の開始日と終了日の取得
        $startDate = "{$year}-01-01";
        $endDate = "{$year}-12-31";

        if ($userMode === 'common') {
            $couple_id = $user->couple_id;
        } else {
            $couple_id = null;
        }

        try {
            // 予算の取得
            $budget = $this->getBudgetData($couple_id, $userId);
            // 実績の取得
            $paymentRecords = $this->getPaymentRecords($couple_id, $userId, $budget, $startDate, $endDate);
            // 予算と実績を結合
            $connectedData = $this->connectBudgetAndPaymentRecords($budget, $paymentRecords);

            return response()->json([
                'status' => true,
                'data' => $connectedData,
            ]);
        } catch (\Exception $e) {
            Log::error('予算の取得に失敗しました', [
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'status' => false,
                'message' => '予算の取得に失敗しました',
            ], 500);
        }
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

    private function getPaymentRecords($couple_id, $userId, $budget, $startDate, $endDate)
    {
        $query = Payment::selectRaw('
                MONTH(payment_date) as month,
                category_id,
                SUM(amount) as amount,
                GROUP_CONCAT(id) as payment_ids
            ')
            ->whereIn('category_id', $budget->pluck('category_id'))
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->groupBy('month', 'category_id');


        return $couple_id
        ? $query->where('couple_id', $couple_id)->get()
        : $query->where('recorded_by_user_id', $userId)
            ->whereNull('couple_id')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->get();
    }

    private function connectBudgetAndPaymentRecords($budget, $paymentRecords)
    {
        return $budget->map(function ($budgetItem) use ($paymentRecords) {
            $categoryPaymentRecord = $paymentRecords->where('category_id', $budgetItem->category_id); // 次にsumを使用したいのでtoArrayは最後に実施

            // 12か月分のデータを作成
            $monthlyData = [];
            for ($month = 1; $month <= 12; $month++) {
                $monthRecord = $categoryPaymentRecord->where('month', $month)->first();
                $monthlyData[] = [
                    'month' => $month,
                    'category_id' => $budgetItem->category_id,
                    'amount' => $monthRecord ? (int)$monthRecord->amount : 0,
                    'payment_ids' => $monthRecord ? $monthRecord->payment_ids : '',
                ];
            }

            Log::info($monthlyData);
            Log::info(gettype($monthlyData[8]['amount']));

            // 残りの予算
            $residueBudget = $budgetItem->amount - $categoryPaymentRecord->sum('amount');

            return [
                'id' => $budgetItem->id,
                'category' => $budgetItem->category,
                'budget_amount' => $budgetItem->amount,
                'monthly_data' => $monthlyData,
                'residue_budget' => $residueBudget,
            ];
        });
    }
}
