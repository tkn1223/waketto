<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Traits\ReportDataTrait;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseReportController extends Controller
{
    use ReportDataTrait;

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

        $sortedByCategoryData = $this->getBaseReportData($couple_id, $userId, $startDate, $endDate);

        $subscriptionData = $this->getSubscriptionData($couple_id, $userId, $startDate, $endDate);

        // subscription_costカテゴリーを初期化（subscriptionDataが存在する場合のみ）
        $initializeSubscriptionCategory = $this->initializeSubscriptionCategory($sortedByCategoryData, $subscriptionData);
        $sortedByCategoryData = $initializeSubscriptionCategory['sortedByCategoryData'];
        $subscriptionCategory = $initializeSubscriptionCategory['subscriptionCategory'];

        // サブスク費を一律で１カ月払いで表示させる（支出管理表）
        if ($subscriptionCategory instanceof Category && $subscriptionData instanceof Collection && ! $subscriptionData->isEmpty()) {
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

        $sortedByCategoryData = $this->getTotalExpenseData($sortedByCategoryData);

        return response()->json([
            'status' => true,
            'data' => $sortedByCategoryData,
        ]);
    }
}
