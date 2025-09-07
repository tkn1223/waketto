<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('payments')->insert([
            ['payment_date' => '2025-12-01', 'category_id' => 1, 'paid_by_user_id' => 1, 'recorded_by_user_id' => 9, 'couple_id' => null, 'amount' => 1000, 'store_name' => null, 'note' => '目薬'],
            ['payment_date' => '2025-12-23', 'category_id' => 1, 'paid_by_user_id' => 1, 'recorded_by_user_id' => 8, 'couple_id' => 1, 'amount' => 1000, 'store_name' => 'スーパー', 'note' => 'コロッケ'],
        ]);
    }
}
