<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/blog',       [BlogController::class, 'index']);
Route::get('/blog/{post}', [BlogController::class, 'show']);
