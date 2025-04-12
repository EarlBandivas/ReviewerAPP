<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ForceTenancyClean extends Command
{
    protected $signature = 'tenancy:force-clean';
    protected $description = 'Force clean all tenancy related tables and data';

    public function handle()
    {
        $this->info('Force cleaning all tenancy data...');

        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');

            // Clean domains table
            if (Schema::hasTable('domains')) {
                DB::table('domains')->truncate();
                $this->info('Cleaned domains table');
            }

            // Clean tenants table
            if (Schema::hasTable('tenants')) {
                DB::table('tenants')->truncate();
                $this->info('Cleaned tenants table');
            }

            // Drop all tenant databases
            $databases = DB::select('SHOW DATABASES LIKE "tenant_%"');
            foreach ($databases as $database) {
                $dbName = array_values((array)$database)[0];
                DB::statement("DROP DATABASE IF EXISTS `$dbName`");
                $this->info("Dropped database: $dbName");
            }

            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            
            $this->info('All tenancy data has been cleaned successfully!');
            
        } catch (\Exception $e) {
            $this->error('Error while cleaning: ' . $e->getMessage());
        }
    }
}