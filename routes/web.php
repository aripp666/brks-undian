<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UndianController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
// 👉 Jika buka "/" langsung ke RegistrasiUndian
Route::get('/', function () {
    return redirect('/RegistrasiUndian');
});

Route::post('/cek-undian', [UndianController::class, 'cekUndian']);


// 👉 Halaman utama registrasi undian
Route::get('/RegistrasiUndian', function () {
    return Inertia::render('RegisterUndian');
})->name('registrasiUndian');

Route::get('/', [UndianController::class, 'index']);
Route::post('/send-otp', [UndianController::class, 'sendOtp']);
Route::post('/verify-otp', [UndianController::class, 'verifyOtp']);


Route::get('/admin', [AdminController::class, 'index']);
Route::get('/admin/peserta', [AdminController::class, 'peserta']);
Route::post('/admin/acak-undian', [AdminController::class, 'acakUndian']);
Route::post('/admin/reset-undian', [AdminController::class, 'reset']);


// web.php
Route::get('/admin/machine', function () {
    return Inertia::render('Admin/Machine');
});


// Route::get('/RegistrasiUndian', function () {
//     return Inertia::render('RegisterUndian');
// })->name('registrasiUndian');

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

require __DIR__.'/auth.php';
