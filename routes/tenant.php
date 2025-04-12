<?php

use Illuminate\Support\Facades\Route;

// These routes are only accessible on tenant domains
Route::middleware([
    'web',
    'auth',
])->group(function () {
    // Your tenant routes here
});