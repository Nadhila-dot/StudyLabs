<?php

namespace App\Http\Middleware\admin;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

class AdminOnly
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check() || !Auth::user()->is_admin) {
            // Return a proper HTTP response with a 404 status code
            return response(
                Inertia::render('Errors/404')->toResponse($request)->getContent(),
                404,
                ['Content-Type' => 'text/html']
            );
            
            // Alternatively, redirect to a 404 route:
            // return redirect()->route('404');
        }

        return $next($request);
    }
}