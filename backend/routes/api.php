<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HelloAssoWebhookController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/logout',   [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/events/{event}/checkout-intent', [EventController::class, 'checkoutIntent']);
});

// contact
Route::post('/contact', [ContactController::class, 'send']);

//end contact

// blog
Route::get('/blog',       [BlogController::class, 'index']);
Route::get('/blog/{post}', [BlogController::class, 'show']);

// end blog


// events

Route::get('/events',            [EventController::class, 'index']);
Route::get('/events/categories', [EventController::class, 'categories']); 
Route::get('/events/{event}',    [EventController::class, 'show']);
Route::get('/events/{event}/widget', [EventController::class, 'widget']);
Route::post('/webhooks/helloasso', [HelloAssoWebhookController::class, 'handle']);

// end events
