<?php

namespace App\Http\Middleware\Admin;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class AdminOnly
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check() || !Auth::user()->is_admin) {
            return response(
                Inertia::render('Errors/404')->toResponse($request)->getContent(),
                404,
                ['Content-Type' => 'text/html']
            );
        }

        return $next($request);
    }
}