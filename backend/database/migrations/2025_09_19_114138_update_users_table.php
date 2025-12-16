<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // emailカラムを削除
            $table->dropUnique(['email']);
            $table->dropColumn('email');
            $table->string('cognito_sub', 50)->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('email', 255)->unique()->nullable()->after('cognito_sub');
            $table->string('cognito_sub', 255)->nullable(true)->change();
        });
    }
};
