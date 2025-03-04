<?php

use App\Http\Controllers\Dashboard\MainController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\FileController;
use Inertia\Inertia;

Route::get('/', [MainController::class, 'welcome'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [MainController::class, 'dashboard'])->name('dashboard');
    Route::get('courses', [MainController::class, 'dashboard'])->name('main.courses.index');

    Route::get('/files/{filename}', [FileController::class, 'show'])->name('files.show');
    // Add this route to your admin routes
    Route::get('files/preview/{filename}', [FileController::class, 'preview'])->name('files.preview');

    Route::get('books', [MainController::class, 'books'])->name('main.books');

    
    Route::get('books/redirect/{name}/{url}', [MainController::class, 'redirect'])
        ->name('main.books.redirect')
        ->where('url', '.*'); // Allow any character in URL
    
    Route::get('resources', [MainController::class, 'resources'])->name('main.resources');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';

// Fallback route for 404 errors
Route::fallback(function () {
    return Inertia::render('Errors/404');
});