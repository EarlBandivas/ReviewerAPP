<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Tenant/Home', [
        'tenant' => tenant(),
    ]);
});

Route::get('/dashboard', function () {
    return 'Tenant dashboard for ' . tenant('id');
});


