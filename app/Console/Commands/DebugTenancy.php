<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DebugTenancy extends Command
{
    protected $signature = 'tenancy:debug {--clean : Clean up all tenancy tables}';
    protected $description = 'Debug and clean up tenancy tables';

    public function handle()
    {
        $this->info('Checking tenancy tables...');
        
        // Check domains table
        $domains = DB::table('domains')->get();
        $this->info('Domains table contents:');
        $this->table(['id', 'domain', 'tenant_id', 'created_at'], $domains->toArray());

        // Check tenants table
        $tenants = DB::table('tenants')->get();
        $this->info('Tenants table contents:');
        $this->table(['id', 'company_name', 'created_at'], $tenants->toArray());

        if ($this->option('clean')) {
            $this->info('Cleaning up tenancy tables...');
            
            // Disable foreign key checks
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            
            // Truncate all related tables
            DB::table('domains')->truncate();
            DB::table('tenants')->truncate();
            
            // Enable foreign key checks
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            
            $this->info('Tables cleaned successfully!');
        }

        // Additional debug information
        $this->info('Current database connection: ' . config('database.default'));
        $this->info('Current database name: ' . config('database.connections.' . config('database.default') . '.database'));
    }
}