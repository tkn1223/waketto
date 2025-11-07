<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('user_settings')->insert([
            ['user_id' => 1, 'status' => 'company_employee', 'has_car' => '1', 'has_house' => '1'],
            ['user_id' => 2, 'status' => 'business_owner', 'has_car' => '0', 'has_house' => '0'],
            ['user_id' => 3, 'status' => 'add_side_job', 'has_car' => '1', 'has_house' => '0'],
        ]);
    }
}
