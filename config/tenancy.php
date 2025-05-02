<?php

use Stancl\Tenancy\Database\Models\Domain;
use Stancl\Tenancy\Database\Models\Tenant;

return [
    'tenant_model' => \App\Models\Tenant::class,
    'domain_model' => Domain::class,

    'database' => [
        'central_connection' => env('DB_CONNECTION', 'mysql'),
        
        // The tenant connection that will be used to connect to tenant databases
        'tenant_connection' => env('TENANT_DB_CONNECTION', 'tenant'),
        
        'prefix' => 'tenant',
        'suffix' => '',
    ],

    'domain_model' => Domain::class,
    
    'central_domains' => [
        'localhost',
        '127.0.0.1',
        'localhost:8000',
        '127.0.0.1:8000',
        env('APP_DOMAIN', 'localhost'),
    ],

    'identification' => [
        'domain' => [
            'enable' => true,
            'exclude' => [
                '/',
                '/login',
                '/logout',
                '/dashboard',
                '/profile',
                '/tenant/register',
                '/forgot-password',
                '/reset-password',
                '/verify-email',
                '/debug-tenancy',
                '/debug-db',
                '/check-db',
                '/analytics',
            ],
        ],
    ],

    'bootstrappers' => [
        Stancl\Tenancy\Bootstrappers\DatabaseTenancyBootstrapper::class,
        Stancl\Tenancy\Bootstrappers\CacheTenancyBootstrapper::class,
        Stancl\Tenancy\Bootstrappers\FilesystemTenancyBootstrapper::class,
        Stancl\Tenancy\Bootstrappers\QueueTenancyBootstrapper::class,
    ],
];

















