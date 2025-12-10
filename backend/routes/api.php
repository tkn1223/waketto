<?php

use App\Http\Controllers\Api\BudgetUsageController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ExpenseReportController;
use App\Http\Controllers\Api\HouseholdReportController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// requestにユーザー情報を追加（UserControllerで取得）
// Route::middleware('cognito')->get('/user', function (Request $request) {
//     return $request->attributes->get('auth_user');
// });

// 認証が必要なルート
Route::middleware('cognito')->group(function () {
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);

    // ユーザー情報取得のルート
    Route::get('/user', [UserController::class, 'getUserInfo']);

    // 初回表示時のルート
    Route::get('/categories', [CategoryController::class, 'index']);

    // 取引明細関連のルート
    Route::prefix('transaction')->group(function () {
        Route::post('/{userMode}', [TransactionController::class, 'store']);
        Route::put('/{id}', [TransactionController::class, 'update']);
        Route::delete('/{id}', [TransactionController::class, 'delete']);
    });

    // 支出管理表関連のルート
    Route::prefix('expense-report')->group(function () {
        Route::get('/{userMode}', [ExpenseReportController::class, 'index']);
    });

    // 家計簿関連のルート
    Route::prefix('household-report')->group(function () {
        Route::get('/{userMode}', [HouseholdReportController::class, 'index']);
    });

    // 予算関連のルート
    Route::prefix('budget')->group(function () {
        Route::get('/usage/{userMode}', [BudgetUsageController::class, 'index']);
        Route::get('/setting/{userMode}', [BudgetUsageController::class, 'budgetSetting']);
        Route::post('/setting/updateBudget/{userMode}', [BudgetUsageController::class, 'updateBudgetSetting']);
    });

    // サブスクリプション関連のルート
    Route::prefix('subscription')->group(function () {
        Route::get('/setting/{userMode}', [SubscriptionController::class, 'getSubscriptions']);
        Route::post('/setting/updateSubscriptions/{userMode}', [SubscriptionController::class, 'updateSubscriptions']);
    });

    // 設定関連のルート
    Route::prefix('partner-setting')->group(function () {
        Route::post('/', [SettingController::class, 'entry']);
        Route::delete('/reset', [SettingController::class, 'reset']);
    });
});

// パブリックルート（認証不要）
Route::get('/health', function () {
    return ['status' => 'ok', 'message' => 'API is running'];
});
