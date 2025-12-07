<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Traits\ReportDataTrait;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HouseholdReportController extends Controller
{
    use ReportDataTrait;

    public function index(Request $request, $userMode): JsonResponse
    {
        $user = $request->attributes->get('auth_user');
        $userId = $user->id;

        // クエリパラメータから年月を取得（整数に変換）
        $year = (int) $request->query('year', date('Y'));
        $month = (int) $request->query('month', date('n'));

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

        // サブスク費を支払った日付で表示させる（家計簿）
        if ($subscriptionCategory instanceof Category && $subscriptionData instanceof Collection && ! $subscriptionData->isEmpty()) {
            foreach ($subscriptionData as $subscription) {
                if ($subscription->billing_interval === 'monthly') {
                    // 日付を作成
                    $day = date('d', strtotime($subscription->start_date));

                    // 有効な日付かチェック（例：2月30日は存在しない）
                    if (! checkdate($month, $day, $year)) {
                        $paymentDate = date('Y-m-t', strtotime("{$year}-{$month}-01"));
                    } else {
                        $paymentDate = sprintf('%04d-%02d-%02d', $year, $month, $day);
                    }

                    $paymentAmount = $subscription->amount;
                } else {
                    $startDate = Carbon::parse($subscription->start_date);
                    $startYear = $startDate->year;
                    $startMonth = $startDate->month;
                    $startDay = $startDate->day;

                    Log::info('subscription: '.$subscription->service_name);
                    Log::info('startYear: '.$startYear);
                    Log::info('startMonth: '.$startMonth);
                    Log::info('startDay: '.$startDay);

                    // 開始月と異なる月はスキップ
                    if ($month !== $startMonth) {
                        continue;
                    }

                    // 開始年より前はスキップ
                    if ($year < $startYear) {
                        continue;
                    }

                    // 終了日チェック
                    $endDate = Carbon::parse($subscription->finish_date);
                    $endYear = $endDate->year;
                    $endMonth = $endDate->month;

                    // 終了年月より後の場合はスキップ
                    if ($year > $endYear || ($year === $endYear && $month > $endMonth)) {
                        continue;
                    }

                    // 終了年月と同じ場合は、日付レベルで詳細チェックが必要
                    if ($year === $endYear && $month === $endMonth) {
                        // 支払い予定日を仮計算
                        $tempPaymentDay = checkdate($month, $startDay, $year)
                            ? $startDay
                            : (int) date('t', strtotime("{$year}-{$month}-01"));

                        // 支払い予定日が終了日より後ならスキップ
                        if ($tempPaymentDay > $endDate->day) {
                            continue;
                        }
                    }

                    // 有効な日付かチェック（2月30日などを考慮）
                    if (! checkdate($month, $startDay, $year)) {
                        $paymentDate = date('Y-m-t', strtotime("{$year}-{$month}-01"));
                    } else {
                        $paymentDate = sprintf('%04d-%02d-%02d', $year, $month, $startDay);
                    }

                    $paymentAmount = $subscription->amount;
                }

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
