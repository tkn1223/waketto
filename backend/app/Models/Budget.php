<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class Budget extends Model
{
    protected $fillable = [
        'couple_id',
        'recorded_by_user_id',
        'category_id',
        'period',
        'period_type',
        'amount',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public static function updateBudget($categories, $budgetCheck, $userId, $couple_id, $budgetCheckQuery)
    {
        DB::beginTransaction();
        foreach ($categories as $category) {
            $categoryId = Category::where('code', $category['code'])
                ->first()
                ->id;

            if (!$budgetCheck) {
                // budgetテーブルを新規作成
                Budget::create([
                    'recorded_by_user_id' => $userId,
                    'couple_id' => $couple_id,
                    'category_id' => $categoryId,
                    'period' => $category['period'],
                    'period_type' => $category['periodType'],
                    'amount' => $category['amount'] ?? 0,
                ]);
            } else {
                // 登録されている予算設定データを取得（getしないと2回目のupdateでエラーが発生する）
                $budgetData = $budgetCheckQuery->get();
                $budgetRecord = $budgetData->where('category_id', $categoryId)->first();
                // 予算設定を更新
                $budgetRecord->update([
                    'period' => $category['period'],
                    'period_type' => $category['periodType'],
                    'amount' => $category['amount'] ?? 0,
                ]);
            }
        }
        DB::commit();
    }
}
