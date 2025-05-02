<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCentralDomain
{
    public function handle(Request $request, Closure $next): Response
    {
        // Debug output to see what's happening
        \Log::info('EnsureCentralDomain middleware', [
            'host' => $request->getHost(),
            'central_domains' => config('tenancy.central_domains'),
            'is_central' => in_array($request->getHost(), config('tenancy.central_domains')),
        ]);
        
        if (!in_array($request->getHost(), config('tenancy.central_domains', []))) {
            abort(404);
        }

        return $next($request);
    }
}





