<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Payment;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    public function budgetSetting(Request $request, $userMode): JsonResponse
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
            $budgetSetting = $this->getBudgetSettingData($couple_id, $userId);

            if ($budgetSetting->isEmpty()) {
                // データが存在しない場合、デフォルト値を返す
                $defaults = config('budget-default');
                $budgetSetting = collect($defaults)->values()->flatten(1);
            } else {
                // データが存在する場合、形式を変換して返す
                $budgetSetting = $budgetSetting->map(function ($budget) {
                    return [
                        'name' => $budget->category->name,
                        'code' => $budget->category->code,
                        'groupCode' => $budget->category->group_code,
                        'period' => $budget->period,
                        'periodType' => $budget->period_type,
                        'amount' => $budget->amount,
                    ];
                });
            }

            return response()->json([
                'status' => true,
                'data' => $budgetSetting,
            ]);
        } catch (\Exception $e) {
            Log::error('予算設定の取得に失敗しました', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => false,
                'message' => '予算の取得に失敗しました',
            ], 500);
        }
    }

    public function updateBudgetSetting(Request $request, $userMode): JsonResponse
    {
        $user = $request->attributes->get('auth_user');
        $userId = $user->id;

        if ($userMode === 'common') {
            $couple_id = $user->couple_id;
        } else {
            $couple_id = null;
        }

        // 予算設定が存在するか確認
        $budgetCheckQuery = Budget::where('recorded_by_user_id', $userId);
        if ($couple_id) {
            $budgetCheckQuery->where('couple_id', $couple_id);
        } else {
            $budgetCheckQuery->whereNull('couple_id');
        }
        $budgetCheck = $budgetCheckQuery->exists();

        // 予算設定データを取得
        $categories = $request->json()->all();

        if (empty($categories) || !is_array($categories)) {
            Log::error('渡された予算設定データが不正です', [
                'categories' => $categories,
                'requestBody' => $categories,
            ]);
            return response()->json([
                'status' => false,
                'message' => '渡された予算設定データが不正です',
            ], 422);
        }

        try {
            // 予算設定を更新
            Budget::updateBudget($categories, $budgetCheck, $userId, $couple_id, $budgetCheckQuery);

            return response()->json([
                'status' => true,
                'message' => '予算の設定に成功しました',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('予算の設定に失敗しました', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => false,
                'message' => '予算の設定に失敗しました',
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
                    'amount' => $monthRecord ? (int) $monthRecord->amount : 0,
                    'payment_ids' => $monthRecord ? $monthRecord->payment_ids : '',
                ];
            }

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

    private function getBudgetSettingData($couple_id, $userId)
    {
        $query = Budget::with(['category:id,name,code,group_code'])
            ->select('id', 'period', 'period_type', 'amount', 'category_id');

        return $couple_id
        ? $query->where('couple_id', $couple_id)->get()
        : $query->where('recorded_by_user_id', $userId)
            ->whereNull('couple_id')
            ->get();
    }
}
