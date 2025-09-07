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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->enum('group_code', ['monthly_fixed_cost', 'monthly_variable_cost', 'occasional_fixed_cost', 'occasional_variable_cost', 'luxury_consumption_cost', 'savings_investment_cost']);
            $table->enum('type', ['system', 'user'])->default('system');
            $table->foreignId('recorded_by_user_id')->nullable();
            $table->foreignId('couple_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
