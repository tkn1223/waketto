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
        // group_idカラム追加
        Schema::table('categories', function (Blueprint $table) {
            $table->foreignId('group_id')->nullable()->after('name');
        });

        // 既存データの移行
        DB::statement('
            UPDATE categories c
            INNER JOIN category_groups cg ON c.group_code = cg.code
            SET c.group_id = cg.id
        ');

        // NOT NULL制約を追加
        Schema::table('categories', function (Blueprint $table) {
            $table->foreignId('group_id')->nullable(false)->change();
        });

        // 外部キー制約を追加
        Schema::table('categories', function (Blueprint $table) {
            $table->foreign('group_id')
                ->references('id')
                ->on('category_groups')
                ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropForeign(['group_id']);
            $table->dropColumn('group_id');
        });
    }
};
