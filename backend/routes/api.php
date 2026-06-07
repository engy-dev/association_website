<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\WebhookController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


// contact
Route::post('/contact', [ContactController::class, 'send']);

//end contact

// blog
Route::get('/blog',       [BlogController::class, 'index']);
Route::get('/blog/{post}', [BlogController::class, 'show']);

// end blog

// newsletter
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);
Route::post('/webhook/newsletter', [WebhookController::class, 'handleMailContent']);
Route::get('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe'])->name('newsletter.unsubscribe');