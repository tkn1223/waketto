<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Payment;

class ExpenseReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('auth_user')->id;
        $paymentData = Payment::where('recorded_by_user_id', $userId)
                       ->with('category', 'category.categoryGroup')
                       ->orderBy('payment_date', 'asc')
                       ->get();
        
        $sortedByCategoryData = [];

        foreach ($paymentData as $payment) {
            $groupCode = $payment->category->group_code;
            $categoryCode = $payment->category->code;

            if (!isset($sortedByCategoryData[$groupCode])) {
                $sortedByCategoryData[$groupCode] = [
                    'group_name' => $payment->category->categoryGroup->name,
                    'categories' => []
                ];
            }

            if (!isset($sortedByCategoryData[$groupCode]['categories'][$categoryCode])) {
                $sortedByCategoryData[$groupCode]['categories'][$categoryCode] = [
                    'category_name' => $payment->category->name,
                    'payments' => []
                ];
            }

            $sortedByCategoryData[$groupCode]['categories'][$categoryCode]['payments'][] = [
                'payment_date' => $payment->payment_date,
                'amount' => $payment->amount,
                'store_name' => $payment->store_name,
                'note' => $payment->note,
            ];
        }
        
        return response()->json([
            'status' => true,
            'data' => $sortedByCategoryData,
        ]);
    }
}
