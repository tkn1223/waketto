<?php

namespace App\Traits;

use App\Models\Category;
use App\Models\CategoryGroup;
use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Support\Facades\Log;

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
            
            Log::info($paymentData);
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

            $budgetAmount = $category->budget->first()?->amount;

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
