<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Payment;
use App\Models\CategoryGroup;

class ExpenseReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('auth_user')->id;

        $allCategoryGroups = CategoryGroup::select('code', 'name')
                             ->get();

        $paymentData = Payment::where('recorded_by_user_id', $userId)
                       ->with('category', 'category.categoryGroup')
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
