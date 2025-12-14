<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GuestAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'ゲスト',
            'user_id' => 'guestuser1',
            'cognito_sub' => 'c704eaf8-a0d1-7029-d1df-8730f8653078',
            'couple_id' => null,
        ]);
    }
}
