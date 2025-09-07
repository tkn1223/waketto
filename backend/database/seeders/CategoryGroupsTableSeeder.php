<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoryGroupsTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('category_groups')->insert([
            ['name' => '毎月固定費', 'code' => 'monthly_fixed_cost'],
            ['name' => '毎月変動費', 'code' => 'monthly_variable_cost'],
            ['name' => '不定期固定費', 'code' => 'occasional_fixed_cost'],
            ['name' => '不定期変動費', 'code' => 'occasional_variable_cost'],
            ['name' => '豊かな浪費', 'code' => 'luxury_consumption_cost'],
            ['name' => '貯蓄・投資', 'code' => 'savings_investment_cost'],
        ]);
    }
}
