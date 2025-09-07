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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('couple_id')->nullable();
            $table->foreignId('recorded_by_user_id');
            $table->enum('category_id', ['monthly_fixed_cost', 'occasional_fixed_cost'])->default('monthly_fixed_cost');
            $table->string('service_name');
            $table->integer('amount');
            $table->enum('billing_interval', ['monthly', 'yearly'])->nullable();
            $table->integer('billing_interval_count')->nullable();
            $table->date('started_date')->nullable();
            $table->string('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
