<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class BudgetUsageController extends Controller
{
    /**
     * 予算使用状況を取得する
     * 
     * 指定年度の予算設定を支払い実績を取得し、カテゴリーごとの目次データとして返す。
     * 
     * @param Request $request
     * @param string $userMode ユーザーモード（個人/共有）
     * @return JsonResponse 成功時: {status: true, data: 予算使用状況配列}, 失敗時: {status: false, message: エラーメッセージ}
     */
    public function index(Request $request, $userMode): JsonResponse
    {
        $user = $request->attributes->get('auth_user');
        $userId = $user->id;

        $year = $request->query('year', date('Y'));

        // 年度の開始日と終了日の取得
        $startDate = "{$year}-01-01";
        $endDate = "{$year}-12-31";

        // couple_idの有無で個人 / 共有モードの判断をできるようにする
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

    /**
     * 予算設定を取得する
     * 
     * @param Request $request
     * @param string $userMode ユーザーモード（個人/共有）
     * @return JsonResponse 成功時: {status: true, data: 予算設定配列}, 失敗時: {status: false, message: エラーメッセージ}
     */
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
                        'groupCode' => $budget->category->categoryGroup->code,
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

    /**
     * 予算設定を更新する
     * 
     * リクエストで受け取ったカテゴリごとの予算設定をバリデーションし、
     * ログインユーザーおよびユーザーモードを考慮して予算データを更新する。
     * 
     * @param Request $request
     * @param string $userMode ユーザーモード（個人/共有）
     * @return JsonResponse 成功時: {status: true, message: 予算の設定に成功しました}, 失敗時: {status: false, message: 予算の設定に失敗しました}
     */
    public function updateBudgetSetting(Request $request, $userMode): JsonResponse
    {
        // バリデーションチェック
        $validator = Validator::make($request->all(), [
            'categories' => 'required|array|min:1',
            'categories.*.code' => 'required|string|exists:categories,code',
            'categories.*.period' => 'nullable|integer|min:1|max:12',
            'categories.*.periodType' => 'required|string|in:monthly,yearly',
            'categories.*.amount' => 'nullable|numeric|min:0',
        ], [
            'categories.required' => '値が読み込めません。リロードしてください。',
            'categories.array' => '値が読み込めません。リロードしてください。',
            'categories.min' => '値が読み込めません。リロードしてください。',
            'categories.*.code.required' => '値が読み込めません。リロードしてください。',
            'categories.*.code.string' => '値が読み込めません。リロードしてください。',
            'categories.*.code.exists' => '指定されたカテゴリーコードは存在しません',
            'categories.*.period.integer' => '期間は整数で入力してください',
            'categories.*.period.min' => '期間は1~12の間で入力してください',
            'categories.*.period.max' => '期間は1~12の間で入力してください',
            'categories.*.periodType.required' => '期間タイプは必須です',
            'categories.*.periodType.string' => '期間が正しく入力されていません',
            'categories.*.periodType.in' => '期間が正しく入力されていません',
            'categories.*.amount.numeric' => '予算額は数値で入力してください',
            'categories.*.amount.min' => '予算額は0以上で入力してください',
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

        // 予算設定データを取得（categoriesキーから配列を取得）
        $categories = $validator->validated()['categories'];

        if (empty($categories) || ! is_array($categories)) {
            Log::error('渡された予算設定データが不正です', [
                'categories' => $categories,
                'request_all' => $request->all(),
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

    /**
     * 予算データを取得する
     * 
     * @param int|null $couple_id カップルID（null=個人）
     * @param int $userId ユーザーID
     * @return Collection 予算データ
     */
    private function getBudgetData($couple_id, $userId)
    {
        $query = Budget::with(['category:id,name,code'])
            ->select('id', 'amount', 'category_id', 'period_type');

        return $couple_id
            ? $query->where('couple_id', $couple_id)->get()
            : $query->where('recorded_by_user_id', $userId)
                ->whereNull('couple_id')
                ->get();
    }

    /**
     * 支払い実績を取得する
     * 
     * 予算が設定されているカテゴリの支払い実績を取得し、さらにカテゴリごとの月次データとして返す。
     * 
     * @param int|null $couple_id カップルID（null=個人）
     * @param int $userId ユーザーID
     * @param Collection $budget 予算データ
     * @param string $startDate 開始日
     * @param string $endDate 終了日
     * @return Collection 支払い実績データ
     */
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
                ->get();
    }

    /**
     * 予算データと支払い実績データを結合する
     * 
     * 予算データと支払い実績データを結合し、カテゴリごとの月次実績データと残りの予算を返す。
     * 
     * @param Collection $budget 予算データ
     * @param Collection $paymentRecords 支払い実績データ
     * @return Collection 結合後のデータ（予算情報 + 12ヶ月分の月次実績 + 残り予算）
     */
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
                'period_type' => $budgetItem->period_type,
                'budget_amount' => $budgetItem->amount,
                'monthly_data' => $monthlyData,
                'residue_budget' => $residueBudget,
            ];
        });
    }

    /**
     * 予算データを取得する
     * 
     * @param int|null $couple_id カップルID（null=個人）
     * @param int $userId ユーザーID
     * @return Collection 予算データ
     */
    private function getBudgetSettingData($couple_id, $userId)
    {
        $query = Budget::with([
            'category:id,name,group_id,code',
            'category.categoryGroup:id,code,name',
        ])
            ->select('id', 'period', 'period_type', 'amount', 'category_id');

        return $couple_id
            ? $query->where('couple_id', $couple_id)->get()
            : $query->where('recorded_by_user_id', $userId)
                ->whereNull('couple_id')
                ->get();
    }
}
