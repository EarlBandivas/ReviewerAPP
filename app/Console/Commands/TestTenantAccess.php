<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use Illuminate\Console\Command;
use Stancl\Tenancy\Facades\Tenancy;
use Illuminate\Support\Facades\DB;

class TestTenantAccess extends Command
{
    protected $signature = 'tenant:test-access {id?}';
    protected $description = 'Test tenant access and initialization';

    public function handle()
    {
        $id = $this->argument('id') ?? 'test';
        
        $tenant = Tenant::find($id);
        
        if (!$tenant) {
            $this->error("Tenant {$id} not found");
            return 1;
        }
        
        $this->info("Testing tenant: {$tenant->id}");
        
        // Get domains
        $domains = $tenant->domains;
        $this->info('Domains:');
        foreach ($domains as $domain) {
            $this->line("- {$domain->domain}");
        }
        
        // Test initialization
        $this->info('Initializing tenant...');
        try {
            // Get database name before initialization
            $this->info('Expected database name: ' . $tenant->getDatabaseName());
            
            tenancy()->initialize($tenant);
            $this->info('Tenant initialized successfully!');
            $this->info('Current tenant ID: ' . tenant('id'));
            $this->info('Database connection: ' . config('database.default'));
            $this->info('Database name: ' . config('database.connections.' . config('database.default') . '.database'));
            
            // Check if the database exists
            try {
                $databaseExists = DB::select("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?", [$tenant->getDatabaseName()]);
                $this->info('Database exists: ' . (count($databaseExists) > 0 ? 'Yes' : 'No'));
            } catch (\Exception $e) {
                $this->error('Error checking database: ' . $e->getMessage());
            }
        } catch (\Exception $e) {
            $this->error('Failed to initialize tenant: ' . $e->getMessage());
        }
        
        return 0;
    }
}
