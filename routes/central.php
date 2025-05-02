<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TenantController;

// Public routes for central domain
Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Add dashboard route
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');

// Add profile routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/tenant/action', [TenantController::class, 'action'])->name('tenant.action');
});

Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');
Route::get('/dashboard', [TenantController::class, 'index'])->name('dashboard');
Route::post('/tenant/register', [TenantController::class, 'register'])
        ->name('tenant.register');


// Include all auth routes
require __DIR__.'/auth.php';

// Debug routes
Route::get('/debug-tenancy', function () {
    return [
        'host' => request()->getHost(),
        'is_tenant' => tenancy()->initialized,
        'tenant_id' => tenancy()->initialized ? tenant('id') : null,
        'central_domains' => config('tenancy.central_domains'),
    ];
});

// Add more central routes as needed







