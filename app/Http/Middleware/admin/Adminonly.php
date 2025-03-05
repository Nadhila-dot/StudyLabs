<?php

namespace App\Http\Middleware\Admin;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminOnly
{
    public function handle(Request $request, Closure $next): mixed
    {
        if (!Auth::check() || !Auth::user()->is_admin) {
            return redirect('/404');
        }

        return $next($request);
    }
}
