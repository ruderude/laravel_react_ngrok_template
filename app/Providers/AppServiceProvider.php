<?php

namespace App\Providers;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // ========================================
        // デバッグ時の時刻シミュレーション
        // ========================================
        // 開発時に ?date=2025-01-01 などのクエリパラメータで
        // アプリケーション内の現在時刻を変更できる
        // 例: http://localhost/?date=2025-12-31
        if ($this->app->runningInConsole() === false) {
            $is_debug = env("APP_DEBUG");
            if ($is_debug) {
                $date = request()->query("date");
                if ($date !== null) {
                    $date = Carbon::parse($date);
                    Carbon::setTestNow($date); // Carbon の現在時刻を上書き
                }
            }
        }

        // ========================================
        // HTTPS 強制リダイレクト
        // ========================================
        // localhost 以外のアクセスは HTTPS を強制
        // 本番環境・ステージング環境でのセキュリティ確保
        if (request()->getHost() !== "localhost") {
            URL::forceScheme("https");
        }
    }
}
