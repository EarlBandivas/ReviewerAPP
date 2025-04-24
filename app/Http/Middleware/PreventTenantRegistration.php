<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class PreventTenantRegistration
{
    public function handle(Request $request, Closure $next)
    {
        // If this is the registration route and it's not an admin registration
        if ($request->routeIs('register') && !$request->session()->has('admin_registration')) {
            abort(404);
        }

        return $next($request);
    }
}