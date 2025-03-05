<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Admin\FileController;
use App\Http\Controllers\Admin\ResourceController;
use App\Http\Controllers\Admin;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// All routes here have the 'admin' prefix and middleware
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Admin dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('index');
    
    // User management
    Route::resource('users', UsersController::class);
    
    // Additional admin routes
    //need to be implemented later
    Route::get('settings', [DashboardController::class, 'settings'])->name('settings');
    Route::get('analytics', [DashboardController::class, 'analytics'])->name('analytics');

    Route::get('/resources', [ResourceController::class, 'index'])->name('resources');
    Route::post('/resources', [ResourceController::class, 'store'])->name('resources.store');
    Route::get('/resources/edit/{id}', [ResourceController::class, 'edit'])->name('resources.edit');
    Route::put('/resources/{id}', [ResourceController::class, 'update'])->name('resources.update');
    Route::delete('/resources/{id}', [ResourceController::class, 'destroy'])->name('resources.destroy');


    Route::resource('books', Admin\BookController::class);

    Route::get('users', [Admin\UsersController::class, 'index'])->name('users.index');
    Route::put('users/{user}', [Admin\UsersController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [Admin\UsersController::class, 'destroy'])->name('users.destroy');

    Route::get('files', [FileController::class, 'index'])->name('files.index');
    Route::post('files', [FileController::class, 'store'])->name('files.store');
    Route::delete('files/{filename}', [FileController::class, 'destroy'])->name('files.destroy');
});

// Fallback route for 404 errors
Route::fallback(function () {
    return Inertia::render('Errors/404');
});