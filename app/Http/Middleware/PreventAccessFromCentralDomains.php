<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Tenant;

class PreventAccessFromCentralDomains
{
    public function handle(Request $request, Closure $next)
    {
        $centralDomains = config('tenancy.central_domains', []);
        
        if (in_array($request->getHost(), $centralDomains)) {
            abort(404);
        }

        // Check if tenant is disabled
        $tenant = Tenant::find(tenant('id'));
        if ($tenant && $tenant->is_disabled) {
            abort(403, 'This website is currently disabled.');
        }

        return $next($request);
    }
}
