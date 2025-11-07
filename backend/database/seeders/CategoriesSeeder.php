<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // 毎月固定費
            ['name' => '住居費', 'code' => 'housing_cost', 'group_code' => 'monthly_fixed_cost', 'type' => 'system'],
            ['name' => '水道光熱費', 'code' => 'utilities_cost', 'group_code' => 'monthly_fixed_cost', 'type' => 'system'],
            ['name' => '社会保険料', 'code' => 'social_insurance', 'group_code' => 'monthly_fixed_cost', 'type' => 'system'],
            ['name' => '生命保険料', 'code' => 'life_insurance', 'group_code' => 'monthly_fixed_cost', 'type' => 'system'],
            ['name' => '教育費', 'code' => 'monthly_education_cost', 'group_code' => 'monthly_fixed_cost', 'type' => 'system'],
            ['name' => '通信費', 'code' => 'communication_cost', 'group_code' => 'monthly_fixed_cost', 'type' => 'system'],
            ['name' => 'サブスク費', 'code' => 'subscription_cost', 'group_code' => 'monthly_fixed_cost', 'type' => 'system'],

            // 毎月変動費
            ['name' => '食費', 'code' => 'food_cost', 'group_code' => 'monthly_variable_cost', 'type' => 'system'],
            ['name' => '日用品費', 'code' => 'daily_goods_cost', 'group_code' => 'monthly_variable_cost', 'type' => 'system'],
            ['name' => '美容費', 'code' => 'beauty_cost', 'group_code' => 'monthly_variable_cost', 'type' => 'system'],
            ['name' => '被服費', 'code' => 'clothing_cost', 'group_code' => 'monthly_variable_cost', 'type' => 'system'],
            ['name' => '医療費', 'code' => 'medical_cost', 'group_code' => 'monthly_variable_cost', 'type' => 'system'],
            ['name' => '交通費', 'code' => 'transportation_cost', 'group_code' => 'monthly_variable_cost', 'type' => 'system'],
            ['name' => 'ガソリン費', 'code' => 'gasoline_cost', 'group_code' => 'monthly_variable_cost', 'type' => 'system'],

            // 不定期固定費
            ['name' => '税金', 'code' => 'tax_cost', 'group_code' => 'occasional_fixed_cost', 'type' => 'system'],
            ['name' => '火災保険料', 'code' => 'fire_insurance', 'group_code' => 'occasional_fixed_cost', 'type' => 'system'],
            ['name' => '自動車保険', 'code' => 'auto_insurance', 'group_code' => 'occasional_fixed_cost', 'type' => 'system'],
            ['name' => '年会費', 'code' => 'annual_fee', 'group_code' => 'occasional_fixed_cost', 'type' => 'system'],
            ['name' => '車検費', 'code' => 'vehicle_inspection_fee', 'group_code' => 'occasional_fixed_cost', 'type' => 'system'],
            ['name' => '教育費', 'code' => 'occasional_education_cost', 'group_code' => 'occasional_fixed_cost', 'type' => 'system'],

            // 不定期変動費
            ['name' => '家電、家具', 'code' => 'appliances_furniture', 'group_code' => 'occasional_variable_cost', 'type' => 'system'],
            ['name' => '車修理費', 'code' => 'car_repair_cost', 'group_code' => 'occasional_variable_cost', 'type' => 'system'],
            ['name' => '冠婚葬祭', 'code' => 'ceremony_cost', 'group_code' => 'occasional_variable_cost', 'type' => 'system'],
            ['name' => '卒業入学費用', 'code' => 'school_event_cost', 'group_code' => 'occasional_variable_cost', 'type' => 'system'],
            ['name' => '治療費', 'code' => 'treatment_cost', 'group_code' => 'occasional_variable_cost', 'type' => 'system'],
            ['name' => '引っ越し', 'code' => 'moving_cost', 'group_code' => 'occasional_variable_cost', 'type' => 'system'],

            // 豊かな浪費
            ['name' => '交際費', 'code' => 'entertainment_cost', 'group_code' => 'luxury_consumption_cost', 'type' => 'system'],
            ['name' => '旅行費', 'code' => 'travel_cost', 'group_code' => 'luxury_consumption_cost', 'type' => 'system'],
            ['name' => '娯楽費', 'code' => 'recreation_cost', 'group_code' => 'luxury_consumption_cost', 'type' => 'system'],

            // 貯蓄・投資
            ['name' => 'つみたて投資', 'code' => 'investment_savings', 'group_code' => 'savings_investment_cost', 'type' => 'system'],
        ];

        DB::table('categories')->insert($categories);
    }
}
