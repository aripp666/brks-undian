<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check()) {
            return redirect('/login')->with('error', 'Silakan login terlebih dahulu');
        }

        if (auth()->user()->role !== 'admin') {
            return redirect('/')->with('error', 'Anda tidak memiliki akses');
        }

        return $next($request);
    }
}
