<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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

    public function couple()
    {
        return $this->belongsTo(Couple::class, 'couple_id', 'id');
    }

    /**
     * 予算設定を更新する
     *
     * $budgetCheckの結果に応じて、予算設定を新規作成または更新する。
     *
     * @param  array  $categories  カテゴリごとの予算設定配列
     * @param  bool  $budgetCheck  true=更新、false=新規作成
     * @param  int  $userId  ユーザーID
     * @param  int|null  $couple_id  カップルID（null=個人）
     * @param  Builder  $budgetCheckQuery  予算設定検索用クエリビルダー
     * @return void
     */
    public static function updateBudget($categories, $budgetCheck, $userId, $couple_id, $budgetCheckQuery)
    {
        DB::beginTransaction();
        foreach ($categories as $category) {
            $categoryId = Category::where('code', $category['code'])
                ->first()
                ->id;

            if (! $budgetCheck) {
                // budgetテーブルを新規作成
                Budget::create([
                    'recorded_by_user_id' => $userId,
                    'couple_id' => $couple_id,
                    'category_id' => $categoryId,
                    'period' => 1,
                    'period_type' => $category['periodType'],
                    'amount' => $category['amount'] ?? 0,
                ]);
            } else {
                // 登録されている予算設定データを取得（getしないと2回目のupdateでエラーが発生する）
                $budgetData = $budgetCheckQuery->get();
                $budgetRecord = $budgetData->where('category_id', $categoryId)->first();
                // 予算設定を更新
                $budgetRecord->update([
                    'period' => 1,
                    'period_type' => $category['periodType'],
                    'amount' => $category['amount'] ?? 0,
                ]);
            }
        }
        DB::commit();
    }
}
