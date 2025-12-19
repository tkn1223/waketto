<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BudgetsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run($userId = null): void
    {
        // ユーザーIDが指定されていない場合はデフォルト値を使用
        $userId = $userId ?? 1;

        // カテゴリーIDを名前とgroup_idから取得
        $housingCostId = DB::table('categories')
            ->where('name', '住居費')
            ->value('id');
        $utilitiesCostId = DB::table('categories')
            ->where('name', '水道光熱費')
            ->value('id');
        $foodCostId = DB::table('categories')
            ->where('name', '食費')
            ->value('id');

        DB::table('budgets')->insert([
            [
                'couple_id' => null,
                'recorded_by_user_id' => $userId,
                'category_id' => $housingCostId, // 住居費
                'period' => 1,
                'period_type' => 'monthly',
                'amount' => 100000,
            ],
            [
                'couple_id' => null,
                'recorded_by_user_id' => $userId,
                'category_id' => $utilitiesCostId, // 水道光熱費
                'period' => 1,
                'period_type' => 'monthly',
                'amount' => 15000,
            ],
            [
                'couple_id' => null,
                'recorded_by_user_id' => $userId,
                'category_id' => $foodCostId, // 食費
                'period' => 1,
                'period_type' => 'monthly',
                'amount' => 50000,
            ],
        ]);
    }
}
