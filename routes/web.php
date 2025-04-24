<?php

use App\Http\Middleware\EnsureCentralDomain;
use App\Http\Middleware\PreventAccessFromCentralDomains;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\TenantController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnalyticsController;
use Inertia\Inertia;

// Central domain routes
Route::middleware(['web', 'ensure.central.domain'])->group(function () {
    // Public routes
    Route::get('/', function () {
        return Inertia::render('Welcome');
    });

    // Guest routes
    Route::middleware('guest')->group(function () {
        Route::get('login', [AuthenticatedSessionController::class, 'create'])
            ->name('login');
        Route::post('login', [AuthenticatedSessionController::class, 'store']);

        // Password reset routes
        Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
            ->name('password.request');
        Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
            ->name('password.email');
        Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
            ->name('password.reset');
        Route::post('reset-password', [NewPasswordController::class, 'store'])
            ->name('password.store');
    });

    // Protected routes
    Route::middleware(['auth'])->group(function () {
        Route::get('/dashboard', [TenantController::class, 'index'])->name('dashboard');
        
        // Add the tenant view route
        Route::get('/tenant/{id}', [TenantController::class, 'view'])->name('tenant.view');

        // Add the tenant action route if not already defined
        Route::post('/tenant/action', [TenantController::class, 'action'])->name('tenant.action');

        Route::get('/profile', [ProfileController::class, 'edit'])
            ->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])
            ->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])
            ->name('profile.destroy');

        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
            ->name('logout');

        Route::post('/tenant/update-subscription', [TenantController::class, 'updateSubscription'])
            ->name('tenant.update-subscription');
        Route::post('/tenant/toggle-status', [TenantController::class, 'toggleStatus'])
            ->name('tenant.toggle-status');

        Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');
    });

    // Tenant registration
    Route::post('/tenant/register', [TenantController::class, 'register'])
        ->name('tenant.register');
});

// Tenant routes
Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    // Tenant specific routes here
});














