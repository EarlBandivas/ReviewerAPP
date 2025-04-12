<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->string('id', 26)->primary();  // Specify length for ULID
            
            // Custom columns
            $table->string('company_name');
            $table->string('address');
            $table->string('phone');
            $table->string('contact_name');
            $table->string('contact_email');
            
            $table->timestamps();
            $table->json('data')->nullable();
            $table->string('status')->default('pending');
            $table->string('temporary_password')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};

