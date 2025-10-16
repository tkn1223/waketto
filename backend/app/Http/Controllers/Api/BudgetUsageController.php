<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Budget;

class BudgetUsageController extends Controller
{
    public function index(Request $request, $userMode): JsonResponse
    {
        $user = $request->attributes->get('auth_user');
        $userId = $user->id;

        if ($userMode === 'common') {
            $couple_id = $user->couple_id;
        } else {
            $couple_id = null;
        }

        try {
            if (isset($couple_id) & $couple_id !== null) {
                $budget = Budget::where('couple_id', $couple_id);
            } else {
                $budget = Budget::where('recorded_by_user_id', $userId)
                                ->whereNull('couple_id');
            }
    
            $budget = $budget->with('category')->get();
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => '予算の取得に失敗しました',
            ], 500);
        }

        return response()->json([
            'status' => true,
            'data' => $budget,
        ]);
    }
}
