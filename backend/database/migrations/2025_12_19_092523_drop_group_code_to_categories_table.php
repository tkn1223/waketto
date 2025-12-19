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
        // codeカラムを削除
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('group_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // codeカラムを復元
        Schema::table('categories', function (Blueprint $table) {
            $table->$table->enum('code', [
                'monthly_fixed_cost',
                'monthly_variable_cost',
                'occasional_fixed_cost',
                'occasional_variable_cost',
                'luxury_consumption_cost',
                'savings_investment_cost'
                ])->after('name');
        });

        // group_idからcodeに値を戻す
        DB::statement('
            UPDATE categories c
            INNER JOIN category_groups cg ON c.group_id = cg.id
            SET c.code = cg.code
        ');
    }
};
