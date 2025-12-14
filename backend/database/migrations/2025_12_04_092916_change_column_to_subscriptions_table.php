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
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn('category_id');
            $table->dropColumn('billing_interval_count');
            $table->enum('billing_interval', ['monthly', 'yearly'])->nullable(false)->change();
            $table->renameColumn('started_date', 'start_date');
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            $table->date('start_date')->nullable(false)->change();
            $table->date('finish_date')->nullable()->after('start_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn('finish_date');
            $table->date('start_date')->nullable()->change();
            $table->renameColumn('start_date', 'started_date');
            $table->enum('billing_interval', ['monthly', 'yearly'])->nullable()->change();
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            $table->integer('billing_interval_count')->nullable()->after('billing_interval');
            $table->enum('category_id', ['monthly_fixed_cost', 'occasional_fixed_cost'])->default('monthly_fixed_cost')->after('recorded_by_user_id');
        });
    }
};
