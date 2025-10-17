<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Payment;
use App\Models\CategoryGroup;

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
            $paymentData = Payment::where('couple_id', $couple_id)
                ->whereBetween('payment_date', [$startDate, $endDate]);
        } else {
            // aloneモード（自分が記録したデータのみ + couple_idがnull)
            $paymentData = Payment::where('recorded_by_user_id', $userId)
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
                'categories' => []
            ];
        }

        foreach ($paymentData as $payment) {
            $groupCode = $payment->category->group_code;
            $categoryCode = $payment->category->code;

            if (!isset($sortedByCategoryData[$groupCode]['categories'][$categoryCode])) {
                $sortedByCategoryData[$groupCode]['categories'][$categoryCode] = [
                    'category_name' => $payment->category->name,
                    'payments' => []
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
            ];
        }
        
        return response()->json([
            'status' => true,
            'data' => $sortedByCategoryData,
        ]);
    }
}
