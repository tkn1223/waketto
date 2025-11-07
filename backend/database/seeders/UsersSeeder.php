<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            ['name' => 'A', 'email' => 'a@example.com', 'password' => 'password', 'couple_id' => 1, 'pair_index' => '1'],
            ['name' => 'B', 'email' => 'b@example.com', 'password' => 'password', 'couple_id' => 1, 'pair_index' => '2'],
            ['name' => 'C', 'email' => 'c@example.com', 'password' => 'password', 'couple_id' => null, 'pair_index' => null],
        ]);
    }
}
