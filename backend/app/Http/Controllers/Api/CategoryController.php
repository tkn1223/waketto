<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * カテゴリーの一覧を取得
     *
     * カテゴリーの一覧を取得し、categoryGroupでグループ化して返す。
     *
     * @return JsonResponse {status: true, data: {グループコード: {group_name: グループ名, categories: [カテゴリー配列]}}}
     */
    public function index(Request $request): JsonResponse
    {
        $categories = Category::select('id', 'name', 'group_id', 'code')
            ->with('categoryGroup:id,code,name')
            ->get();

        // データをグループ化して整形
        $groupedData = [];

        foreach ($categories as $category) {
            $groupCode = $category->categoryGroup->code;
            $groupName = $category->categoryGroup->name ?? $groupCode;

            if (! isset($groupedData[$groupCode])) {
                $groupedData[$groupCode] = [
                    'group_name' => $groupName,
                    'categories' => [],
                ];
            }

            $groupedData[$groupCode]['categories'][] = [
                'id' => $category->id,
                'name' => $category->name,
                'code' => $category->code,
            ];
        }

        return response()->json([
            'status' => true,
            'data' => $groupedData,
        ]);
    }
}
