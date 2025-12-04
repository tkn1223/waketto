<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\CategoryGroup;
use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseReportController extends Controller
{
    public function index(Request $request, $userMode): JsonResponse
    {
        $user = $request->attributes->get('auth_user');
        $userId = $user->id;

        // クエリパラメータから年月を取得
        $year = $request->query('year', date('Y'));
        $month = $request->query('month', date('n'));

        // 開始日と終了日の取得
        $startDate = "{$year}-{$month}-01";
        $endDate = date('Y-m-t', strtotime($startDate));

        if ($userMode === 'common') {
            $couple_id = $user->couple_id;
        } else {
            $couple_id = null;
        }

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

        // subscription_costカテゴリーを初期化（subscriptionDataが存在する場合のみ）
        $subscriptionCategory = Category::where('code', 'subscription_cost')->first();
        if ($subscriptionCategory && ! $subscriptionData->isEmpty() && ! isset($sortedByCategoryData['monthly_fixed_cost']['categories']['subscription_cost'])) {
            $sortedByCategoryData['monthly_fixed_cost']['categories']['subscription_cost'] = [
                'category_name' => $subscriptionCategory->name,
                'budget_amount' => null,
                'payments' => [],
            ];
        }

        if ($subscriptionCategory && ! $subscriptionData->isEmpty()) {
            foreach ($subscriptionData as $subscription) {
                // 日付を作成
                $day = date('d', strtotime($subscription->start_date));

                // 有効な日付かチェック（例：2月30日は存在しない）
                if (! checkdate($month, $day, $year)) {
                    $paymentDate = date('Y-m-t', strtotime("{$year}-{$month}-01"));
                } else {
                    $paymentDate = sprintf('%04d-%02d-%02d', $year, $month, $day);
                }

                $paymentAmount = $subscription->billing_interval === 'monthly' ? $subscription->amount : ceil($subscription->amount / 12);

                $sortedByCategoryData['monthly_fixed_cost']['categories']['subscription_cost']['payments'][] = [
                    'id' => $subscription->id,
                    'user' => $subscription->recorded_by_user_id,
                    'amount' => $paymentAmount,
                    'date' => $paymentDate,
                    'category' => $subscriptionCategory->id,
                    'shop_name' => $subscription->service_name,
                    'memo' => null,
                    'category_group_code' => 'monthly_fixed_cost',
                    'is_subscription' => true, // サブスクリプションかどうか
                ];
            }
        }

        return response()->json([
            'status' => true,
            'data' => $sortedByCategoryData,
        ]);
    }
}
