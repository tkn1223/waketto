<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // システム設定
        $this->call([
            CategoryGroupsTableSeeder::class,
            CategoriesSeeder::class,
        ]);

        // 開発環境
        if (app()->environment(['local', 'development'])) {
            $this->call([
                CouplesSeeder::class,
                PaymentsSeeder::class,
                SubscriptionsSeeder::class,
                UserSettingsSeeder::class,
                UsersSeeder::class,
            ]);
        }
    }
}
