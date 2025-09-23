<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * カテゴリーの一覧を取得
     */
    public function index(Request $request): JsonResponse
    {
        $categories = Category::select('id', 'name', 'code', 'group_code')
            ->with('categoryGroup:code,name')
            ->get();
        
        // データをグループ化して整形
        $groupedData = [];
        
        foreach ($categories as $category) {
            $groupCode = $category->group_code;
            $groupName = $category->categoryGroup->name ?? $groupCode;
            
            if (!isset($groupedData[$groupCode])) {
                $groupedData[$groupCode] = [
                    'group_name' => $groupName,
                    'categories' => []
                ];
            }
            
            $groupedData[$groupCode]['categories'][] = [
                'id' => $category->id,
                'name' => $category->name,
                'code' => $category->code
            ];
        }
        
        return response()->json([
            'status' => true,
            'data' => $groupedData,
        ]);
    }
}
