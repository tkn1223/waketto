<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 既存の外部キー制約を削除（存在する場合）
        $this->dropExistingForeignKeys();

        // users.couple_id の型を unsignedBigInteger に変更（couples.id と互換性を持たせるため）
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('couple_id')->nullable()->change();
        });

        // users.couple_id に外部キー制約を追加
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('couple_id')
                ->references('id')
                ->on('couples')
                ->onDelete('set null');
        });

        // payments テーブルの外部キー制約を追加
        Schema::table('payments', function (Blueprint $table) {
            $table->foreign('category_id')
                ->references('id')
                ->on('categories')
                ->onDelete('restrict');

            $table->foreign('paid_by_user_id')
                ->references('id')
                ->on('users')
                ->onDelete('restrict');

            $table->foreign('recorded_by_user_id')
                ->references('id')
                ->on('users')
                ->onDelete('restrict');

            $table->foreign('couple_id')
                ->references('id')
                ->on('couples')
                ->onDelete('cascade');
        });

        // budgets テーブルの外部キー制約を追加
        Schema::table('budgets', function (Blueprint $table) {
            $table->foreign('couple_id')
                ->references('id')
                ->on('couples')
                ->onDelete('cascade');

            $table->foreign('recorded_by_user_id')
                ->references('id')
                ->on('users')
                ->onDelete('restrict');

            $table->foreign('category_id')
                ->references('id')
                ->on('categories')
                ->onDelete('restrict');
        });

        // subscriptions テーブルの外部キー制約を追加
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->foreign('couple_id')
                ->references('id')
                ->on('couples')
                ->onDelete('cascade');

            $table->foreign('recorded_by_user_id')
                ->references('id')
                ->on('users')
                ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // categories テーブルの外部キー制約を削除
        Schema::table('categories', function (Blueprint $table) {
            $table->dropForeign(['couple_id']);
            $table->dropForeign(['recorded_by_user_id']);
        });

        // subscriptions テーブルの外部キー制約を削除
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropForeign(['couple_id']);
            $table->dropForeign(['recorded_by_user_id']);
        });

        // budgets テーブルの外部キー制約を削除
        Schema::table('budgets', function (Blueprint $table) {
            $table->dropForeign(['couple_id']);
            $table->dropForeign(['recorded_by_user_id']);
            $table->dropForeign(['category_id']);
        });

        // payments テーブルの外部キー制約を削除
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropForeign(['paid_by_user_id']);
            $table->dropForeign(['recorded_by_user_id']);
            $table->dropForeign(['couple_id']);
        });

        // users テーブルの外部キー制約を削除
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['couple_id']);
        });

        // users.couple_id の型を bigInteger に戻す
        Schema::table('users', function (Blueprint $table) {
            $table->bigInteger('couple_id')->nullable()->change();
        });
    }

    /**
     * 既存の外部キー制約を削除（存在する場合のみ）
     */
    private function dropExistingForeignKeys(): void
    {
        $tables = [
            'users' => ['couple_id'],
            'payments' => ['category_id', 'paid_by_user_id', 'recorded_by_user_id', 'couple_id'],
            'budgets' => ['couple_id', 'recorded_by_user_id', 'category_id'],
            'subscriptions' => ['couple_id', 'recorded_by_user_id'],
            'categories' => ['couple_id', 'recorded_by_user_id'],
        ];

        foreach ($tables as $table => $columns) {
            foreach ($columns as $column) {
                $constraintName = "{$table}_{$column}_foreign";
                $exists = DB::select(
                    'SELECT CONSTRAINT_NAME 
                     FROM information_schema.KEY_COLUMN_USAGE 
                     WHERE TABLE_SCHEMA = DATABASE() 
                     AND TABLE_NAME = ? 
                     AND CONSTRAINT_NAME = ?',
                    [$table, $constraintName]
                );

                if (! empty($exists)) {
                    Schema::table($table, function (Blueprint $table) use ($column) {
                        $table->dropForeign([$column]);
                    });
                }
            }
        }
    }
};
