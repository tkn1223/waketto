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
            $paymentData = Payment::with(['category.budget' => function ($query) use ($couple_id) {
                $query->where('couple_id', $couple_id)
                    ->whereNull('recorded_by_user_id')
                    ->where('period_type', 'monthly');
            }])
                ->where('couple_id', $couple_id)
                ->whereBetween('payment_date', [$startDate, $endDate]);
        } else {
            // aloneモード（自分が記録したデータのみ + couple_idがnull)
            $paymentData = Payment::with(['category.budget' => function ($query) use ($userId) {
                $query->where('recorded_by_user_id', $userId)
                    ->whereNull('couple_id')
                    ->where('period_type', 'monthly');
            }])
                ->where('recorded_by_user_id', $userId)
                ->whereNull('couple_id')
                ->whereBetween('payment_date', [$startDate, $endDate]);
        }

        $paymentData = $paymentData->with('category', 'category.categoryGroup')
            ->orderBy('payment_date', 'asc')
            ->get();

        $sortedByCategoryData = [];

        foreach ($allCategoryGroups as $categoryGroup) {
            $sortedByCategoryData[$categoryGroup->code] = [
                'group_name' => $categoryGroup->name,
                'categories' => [],
            ];
        }

        foreach ($paymentData as $payment) {
            $groupCode = $payment->category->group_code;
            $categoryCode = $payment->category->code;

            if (! isset($sortedByCategoryData[$groupCode]['categories'][$categoryCode])) {

                // 月ごとに設定した予算のみ取得（年ごとは予実で管理しているため）
                $budgetAmount = $payment->category->budget
                    ->where('category_id', $payment->category_id)
                    ->first()
                    ?->amount;

                $sortedByCategoryData[$groupCode]['categories'][$categoryCode] = [
                    'category_name' => $payment->category->name,
                    'budget_amount' => $budgetAmount,
                    'payments' => [],
                ];
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
}
