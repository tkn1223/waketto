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
            // Cognito認証用カラムを追加
            $table->string('cognito_sub')->unique()->nullable()->after('email');
            
            // Cognito認証では不要なカラムを削除
            $table->dropColumn([
                'email_verified_at',  // Cognitoが管理
                'password',           // Cognitoが管理
                'remember_token'      // セッション認証用のため不要
            ]);
        });

        // パスワードリセット用テーブルも削除（Cognito使用のため不要）
        Schema::dropIfExists('password_reset_tokens');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // パスワードリセット用テーブルを復元
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::table('users', function (Blueprint $table) {
            // 削除したカラムを復元
            $table->timestamp('email_verified_at')->nullable()->after('email');
            $table->string('password')->after('email_verified_at');
            $table->rememberToken();
            
            // Cognito用カラムを削除
            $table->dropColumn('cognito_sub');
        });
    }
};
