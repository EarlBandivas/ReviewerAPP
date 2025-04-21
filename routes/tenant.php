<?php

use App\Http\Controllers\Tenant\HomeController;
use App\Http\Controllers\Tenant\ReviewController;
use App\Http\Controllers\Tenant\ProductController;
use App\Http\Controllers\Tenant\ContactController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web'])->group(function () {
    // Public routes
    Route::get('/', [HomeController::class, 'index'])->name('tenant.home');
    Route::get('/about', [HomeController::class, 'about'])->name('tenant.about');
    Route::get('/contact', [ContactController::class, 'show'])->name('tenant.contact');
    Route::post('/contact', [ContactController::class, 'submit'])->name('tenant.contact.submit');
    
    // Reviews
    Route::get('/reviews', [ReviewController::class, 'index'])->name('tenant.reviews');
    Route::get('/reviews/{review}', [ReviewController::class, 'show'])->name('tenant.reviews.show');
    
    // Products
    Route::get('/products', [ProductController::class, 'index'])->name('tenant.products');
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('tenant.products.show');
    
    // Legal pages
    Route::get('/privacy', [HomeController::class, 'privacy'])->name('tenant.privacy');
    Route::get('/terms', [HomeController::class, 'terms'])->name('tenant.terms');

    // Protected routes
    Route::middleware(['auth'])->group(function () {
        Route::get('/dashboard', [HomeController::class, 'dashboard'])->name('tenant.dashboard');
        
        // Reviews management
        Route::post('/reviews', [ReviewController::class, 'store'])->name('tenant.reviews.store');
        Route::put('/reviews/{review}', [ReviewController::class, 'update'])->name('tenant.reviews.update');
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('tenant.reviews.destroy');
        
        // Products management
        Route::post('/products', [ProductController::class, 'store'])->name('tenant.products.store');
        Route::put('/products/{product}', [ProductController::class, 'update'])->name('tenant.products.update');
        Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('tenant.products.destroy');
    });
});
