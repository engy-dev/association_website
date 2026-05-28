<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'email'    => 'required|email|unique:NEWSLETTER_SUBSCRIBERS,email',
            'language' => 'required|in:fr,en,ar',
        ]);

        NewsletterSubscriber::create([
            'email'         => $request->email,
            'newsletters'   => 'general',
            'language'      => $request->language,
            'subscribed_at' => now(),
        ]);

        return response()->json(['message' => 'Subscribed successfully!'], 201);
    }
}