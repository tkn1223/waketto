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
                $query->where('couple_id', $couple_id)
                    ->whereNull('recorded_by_user_id');
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
            $groupCode = $category->group_code;
            $categoryCode = $category->code;

            // 予算データを取得
            $budget = $category->budget->first();

            // period_typeに応じて予算金額を計算
            if ($budget) {
                $budgetAmount = $budget->period_type === 'monthly'
                    ? $budget->amount
                    : ceil($budget->amount / 12);
            } else {
                $budgetAmount = null;
            }

            if (isset($sortedByCategoryData[$groupCode])) {
                $sortedByCategoryData[$groupCode]['categories'][$categoryCode] = [
                    'category_name' => $category->name,
                    'budget_amount' => $budgetAmount,
                    'payments' => [],
                ];
            }
        }

        foreach ($paymentData as $payment) {
            $groupCode = $payment->category->group_code;
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
     * @param  int|null  $couple_id
     * @param  int  $userId
     * @param  string  $startDate
     * @param  string  $endDate
     * @return array $subscriptionData
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
     * サブスクリプションカテゴリーを初期化
     *
     * @param  array  $sortedByCategoryData
     * @param  Collection  $subscriptionData
     * @return array $subscriptionCategory, $sortedByCategoryData
     */
    public function initializeSubscriptionCategory($sortedByCategoryData, $subscriptionData)
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
     * 合計金額を算出
     *
     * @param  array  $sortedByCategoryData
     * @return array $sortedByCategoryData with totals
     */
    public function getTotalExpenseData($sortedByCategoryData)
    {
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
