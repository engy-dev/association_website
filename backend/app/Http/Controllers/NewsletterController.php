<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;


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


    public function unsubscribe(Request $request)
    {
        if (!URL::hasValidSignature($request)) {
            return redirect(env('FRONTEND_URL') . '/unsubscribed?status=invalid');
        }

        $subscriber = NewsletterSubscriber::where('email', $request->email)->first();

        if (!$subscriber) {
            return redirect(env('FRONTEND_URL') . '/unsubscribed?status=notfound');
        }

        $subscriber->delete();

        return redirect(env('FRONTEND_URL') . '/unsubscribed?status=success');
    }
}