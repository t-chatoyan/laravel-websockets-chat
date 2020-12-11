<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChatController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login', [UserController::class, 'login']);
Route::post('register', [UserController::class, 'register']);

Route::group(['middleware' => ['api','jwt.verify']], function ($router) {
    Route::get('logout', [UserController::class, 'logout']);
    Route::get('me', [UserController::class, 'userProfile']);

    Route::get('online-users', [UserController::class, 'onlineUsers']);
    Route::post('send-message', [ChatController::class, 'sendMessage']);
    Route::get('get-messages', [ChatController::class, 'getMessages']);

});
