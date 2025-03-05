<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\admin\AdminOnly;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        // Add a custom key for your admin routes
        
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        
        // Register your admin middleware if needed
        $middleware->alias([
            'admin' => AdminOnly::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();