<?php

use App\Http\Middleware\CustomInitializeTenancyByDomain;
use App\Http\Middleware\PreventAccessFromCentralDomains;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

// Debug routes without any middleware
Route::get('/debug-env', function () {
    return [
        'host' => request()->getHost(),
        'app_url' => config('app.url'),
        'app_domain' => config('app.domain'),
        'central_domains' => config('tenancy.central_domains'),
        'is_central' => in_array(request()->getHost(), config('tenancy.central_domains')),
        'server' => $_SERVER,
    ];
});

Route::get('/check-domain', function () {
    return [
        'host' => request()->getHost(),
        'central_domains' => config('tenancy.central_domains'),
        'is_central' => in_array(request()->getHost(), config('tenancy.central_domains')),
    ];
});

// Central domain routes
if (in_array(request()->getHost(), config('tenancy.central_domains', []))) {
    Route::middleware('web')->group(function () {
        require __DIR__.'/central.php';
    });
} 
// Tenant routes
else {
    Route::middleware([
        'web',
        CustomInitializeTenancyByDomain::class,
        PreventAccessFromCentralDomains::class,
    ])->group(function () {
        require __DIR__.'/tenant.php';
    });
}

Route::get('/debug-db', function () {
    $tenant = \App\Models\Tenant::find('test');
    
    if (!$tenant) {
        return ['error' => 'Tenant not found'];
    }
    
    try {
        tenancy()->initialize($tenant);
        
        // Get tables using the current method
        $tables = [];
        $connection = DB::connection(config('database.default'));
        
        // Use the newer method to get table names
        if (method_exists($connection, 'getDoctrineSchemaManager')) {
            $tables = $connection->getDoctrineSchemaManager()->listTableNames();
        } else {
            // For newer Laravel versions
            $tables = $connection->getSchemaBuilder()->getTables();
        }
        
        return [
            'tenant_id' => tenant('id'),
            'connection' => config('database.default'),
            'database_name' => config('database.connections.' . config('database.default') . '.database'),
            'tables' => $tables,
        ];
    } catch (\Exception $e) {
        return [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ];
    }
});

Route::get('/check-domains', function () {
    $domains = \Stancl\Tenancy\Database\Models\Domain::all();
    $tenants = \App\Models\Tenant::all();
    
    return [
        'domains' => $domains->map(function($domain) {
            return [
                'domain' => $domain->domain,
                'tenant_id' => $domain->tenant_id
            ];
        }),
        'tenants' => $tenants->map(function($tenant) {
            return [
                'id' => $tenant->id,
                'domains' => $tenant->domains->pluck('domain')
            ];
        })
    ];
});

Route::get('/create-test-domain', function () {
    $tenant = \App\Models\Tenant::find('test');
    
    if (!$tenant) {
        return ['error' => 'Tenant not found'];
    }
    
    // Check if domain already exists
    $domain = \Stancl\Tenancy\Database\Models\Domain::where('domain', 'test.localhost')->first();
    
    if ($domain) {
        return ['message' => 'Domain already exists', 'domain' => $domain];
    }
    
    // Create domain
    $domain = $tenant->domains()->create([
        'domain' => 'test.localhost'
    ]);
    
    return ['message' => 'Domain created successfully', 'domain' => $domain];
});

Route::get('/check-domain', function () {
    return [
        'host' => request()->getHost(),
        'central_domains' => config('tenancy.central_domains'),
        'is_central' => in_array(request()->getHost(), config('tenancy.central_domains')),
    ];
});

































