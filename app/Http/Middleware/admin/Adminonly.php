<?php

namespace App\Http\Middleware\Admin;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Middleware\HandleInertiaRequests;

class AdminOnly extends Inertia
{
    protected $rootView = 'app';

    public function handle(Request $request, Closure $next): mixed
    {
        if (!Auth::check() || !Auth::user()->is_admin) {
            return Inertia::render('Errors/404');
        }

        return $next($request);
    }
}