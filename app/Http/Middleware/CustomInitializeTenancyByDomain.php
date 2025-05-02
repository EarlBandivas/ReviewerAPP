<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain as BaseMiddleware;

class CustomInitializeTenancyByDomain extends BaseMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // Skip for central domains
        if (in_array($request->getHost(), config('tenancy.central_domains', []))) {
            return $next($request);
        }
        
        return parent::handle($request, $next);
    }
}

