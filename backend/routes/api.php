<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Http\Request;
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

// requestにユーザー情報を追加
Route::middleware('cognito')->get('/user', function (Request $request) {
    return $request->attributes->get('auth_user');
});

// 認証が必要なルート
Route::middleware('cognito')->group(function () {
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
});

// パブリックルート（認証不要）
Route::get('/health', function () {
    return ['status' => 'ok', 'message' => 'API is running'];
});
