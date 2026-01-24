<?php

namespace App\Traits;

use App\Models\Category;
use App\Models\CategoryGroup;
use App\Models\Payment;
use App\Models\Subscription;

trait ReportDataTrait
{
    /**
     * Paymentを取得しカテゴリー毎にグループ化
     *
     * @param  int|null  $couple_id
     * @param  int  $userId
     * @param  string  $startDate
     * @param  string  $endDate
     * @return array $sortedByCategoryData
     */
    public function getBaseReportData($couple_id, $userId, $startDate, $endDate)
    {
        $allCategoryGroups = CategoryGroup::select('code', 'name')->get();

        if (isset($couple_id) && $couple_id !== null) {
            // commonモード
            $categories = Category::with(['budget' => function ($query) use ($couple_id) {
                $query->where('couple_id', $couple_id);
            }])->get();

            $paymentData = Payment::with('category', 'category.categoryGroup')
                ->where('couple_id', $couple_id)
                ->whereBetween('payment_date', [$startDate, $endDate])
                ->orderBy('payment_date', 'asc')
                ->get();
        } else {
            // aloneモード
            $categories = Category::with(['budget' => function ($query) use ($userId) {
                $query->where('recorded_by_user_id', $userId)
                    ->whereNull('couple_id');
            }])->get();

            $paymentData = Payment::with('category', 'category.categoryGroup')
                ->where('recorded_by_user_id', $userId)
                ->whereNull('couple_id')
                ->whereBetween('payment_date', [$startDate, $endDate])
                ->orderBy('payment_date', 'asc')
                ->get();
        }

        // カテゴリグループの構造を初期化
        $sortedByCategoryData = [];

        foreach ($allCategoryGroups as $categoryGroup) {
            $sortedByCategoryData[$categoryGroup->code] = [
                'group_name' => $categoryGroup->name,
                'categories' => [],
            ];
        }

        foreach ($categories as $category) {
            $groupCode = $category->categoryGroup->code;
            $categoryCode = $category->code;

            // 予算データを取得
            $budget = $category->budget->first();

            // 予算が設定されていない場合はスキップ（支出があるカテゴリーは後から項目を追加）
            if (! $budget) {
                $sortedByCategoryData[$groupCode]['categories'][$categoryCode] = [
                    'category_name' => $category->name,
                    'budget_amount' => null,
                    'payments' => [],
                ];

                continue;
            }

            // period_typeに応じて予算金額を計算
            $budgetAmount = $budget->period_type === 'monthly'
                ? $budget->amount
                : ceil($budget->amount / 12);

            if (isset($sortedByCategoryData[$groupCode])) {
                $sortedByCategoryData[$groupCode]['categories'][$categoryCode] = [
                    'category_name' => $category->name,
                    'budget_amount' => $budgetAmount,
                    'payments' => [],
                ];
            }
        }

        foreach ($paymentData as $payment) {
            $groupCode = $payment->category->categoryGroup->code;
            $categoryCode = $payment->category->code;

            if (! isset($sortedByCategoryData[$groupCode]['categories'][$categoryCode])) {
                continue;
            }

            $sortedByCategoryData[$groupCode]['categories'][$categoryCode]['payments'][] = [
                'id' => $payment->id,
                'user' => $payment->paid_by_user_id,
                'amount' => $payment->amount,
                'date' => $payment->payment_date,
                'category' => $payment->category_id,
                'shop_name' => $payment->store_name,
                'memo' => $payment->note,
                'category_group_code' => $groupCode,
                'is_subscription' => false,
            ];
        }

        return $sortedByCategoryData;
    }

    /**
     * サブスクリプションデータを取得
     *
     * @param  int|null  $couple_id カップルID（null=個人）
     * @param  int  $userId ユーザーID
     * @param  string  $startDate 開始日
     * @param  string  $endDate 終了日
     * @return Collection サブスクリプションデータ
     */
    public function getSubscriptionData($couple_id, $userId, $startDate, $endDate)
    {
        if (isset($couple_id) && $couple_id !== null) {
            // commonモード
            $subscriptionData = Subscription::where('couple_id', $couple_id)
                ->whereDate('start_date', '<=', $endDate)
                ->whereDate('finish_date', '>=', $startDate)
                ->get();
        } else {
            // aloneモード（自分が記録したデータのみ + couple_idがnull)
            $subscriptionData = Subscription::where('recorded_by_user_id', $userId)
                ->whereNull('couple_id')
                ->whereDate('start_date', '<=', $endDate)
                ->whereDate('finish_date', '>=', $startDate)
                ->get();
        }

        return $subscriptionData;
    }

    /**
     * サブスクリプションカテゴリーを追加する
     * 
     * 後からサブスクリプションのデータを追加するために、subscription_costカテゴリーが存在しない場合に、その構造を追加する。
     *
     * @param  array  $sortedByCategoryData カテゴリーごとにグループ化された支出データ
     * @param  Collection  $subscriptionData サブスクリプションデータ
     * @return array {subscriptionCategory: サブスクリプションカテゴリー, sortedByCategoryData: カテゴリーごとにグループ化された支出データ}
     */
    public function addSubscriptionCategory($sortedByCategoryData, $subscriptionData)
    {
        $subscriptionCategory = Category::where('code', 'subscription_cost')->first();
        if ($subscriptionCategory && ! $subscriptionData->isEmpty() && ! isset($sortedByCategoryData['monthly_fixed_cost']['categories']['subscription_cost'])) {
            $sortedByCategoryData['monthly_fixed_cost']['categories']['subscription_cost'] = [
                'category_name' => $subscriptionCategory->name,
                'budget_amount' => null,
                'payments' => [],
            ];
        }

        return [
            'subscriptionCategory' => $subscriptionCategory,
            'sortedByCategoryData' => $sortedByCategoryData,
        ];
    }

    /**
     * 総計を算出
     * 
     * 全カテゴリーの予算合計・支払い合計・差分を計算して配列に追加する。
     *
     * @param  array  $sortedByCategoryData カテゴリーごとにグループ化された支出データ
     * @return array {totalBudget: 予算合計, totalPayment: 支払い合計, defference: 差分}
     */
    public function getTotalExpenseData($sortedByCategoryData)
    {
        // sumを使用するために一時的にCollectionに変換
        $data = collect($sortedByCategoryData);

        $totalBudget = $data->sum(function ($group) {
            return collect($group['categories'])->sum('budget_amount');
        });

        $totalPayment = $data->sum(function ($group) {
            return collect($group['categories'])->sum(function ($category) {
                return collect($category['payments'])->sum('amount');
            });
        });

        $defference = $totalBudget - $totalPayment;

        // 総合計データを配列に追加
        $sortedByCategoryData['totalBudget'] = $totalBudget;
        $sortedByCategoryData['totalPayment'] = $totalPayment;
        $sortedByCategoryData['defference'] = $defference;

        return $sortedByCategoryData;
    }
}
