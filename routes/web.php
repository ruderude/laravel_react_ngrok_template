<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use Illuminate\Support\Facades\Route;

// ヘルスチェック用エンドポイント
Route::get("/up", function () {
    return response()->json([
        "status" => "ok",
        "timestamp" => now()->toDateTimeString(),
    ]);
});

// ログインしなくてもアクセス可能
Route::group([], function () {
    Route::post("/api/login", LoginController::class);
    Route::post("/api/logout", LogoutController::class);
});

Route::get("/{any?}", function () {
    return view("app");
})->where("any", "^(?!api|main|line|up).*");

Route::get("/main/{any}", function () {
    return view("main");
})->where("any", ".*");

Route::get("/line/{any}", function () {
    return view("line");
})->where("any", ".*");
