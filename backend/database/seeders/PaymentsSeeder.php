<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run($userId = null): void
    {
        // ユーザーIDが指定されていない場合はデフォルト値を使用
        $userId = $userId ?? 1;

        // カテゴリーIDをコードから取得
        $housingCostId = DB::table('categories')->where('code', 'housing_cost')->value('id');
        $utilitiesCostId = DB::table('categories')->where('code', 'utilities_cost')->value('id');
        $foodCostId = DB::table('categories')->where('code', 'food_cost')->value('id');

        DB::table('payments')->insert([
            // 住居費の支払い
            [
                'payment_date' => '2025-01-15',
                'category_id' => $housingCostId,
                'paid_by_user_id' => $userId,
                'recorded_by_user_id' => $userId,
                'couple_id' => null,
                'amount' => 80000,
                'store_name' => null,
                'note' => '家賃'
            ],
            // 水道光熱費の支払い
            [
                'payment_date' => '2025-01-20',
                'category_id' => $utilitiesCostId,
                'paid_by_user_id' => $userId,
                'recorded_by_user_id' => $userId,
                'couple_id' => null,
                'amount' => 8000,
                'store_name' => null,
                'note' => '電気代'
            ],
            // 食費の支払い
            [
                'payment_date' => '2025-01-10',
                'category_id' => $foodCostId,
                'paid_by_user_id' => $userId,
                'recorded_by_user_id' => $userId,
                'couple_id' => null,
                'amount' => 15000,
                'store_name' => 'スーパー',
                'note' => '食材'
            ],
            [
                'payment_date' => '2025-01-25',
                'category_id' => $foodCostId,
                'paid_by_user_id' => $userId,
                'recorded_by_user_id' => $userId,
                'couple_id' => null,
                'amount' => 20000,
                'store_name' => 'スーパー',
                'note' => '食材'
            ],
        ]);
    }
}
