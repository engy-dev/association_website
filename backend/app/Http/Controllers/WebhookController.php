<?php

namespace App\Http\Controllers;

use App\Mail\NewsletterMail;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\MailContent;

class WebhookController extends Controller
{
    public function handleMailContent(Request $request)
    {
        $title    = $request->input('title');
        $content  = $request->input('content');
        $language = $request->input('language');

        if (!$title || !$content || !$language) {
            return response()->json(['error' => 'Missing fields'], 400);
        }

        MailContent::create([
        'title'    => $title,
        'content'  => $content,
        'language' => $language,
    ]);

        $subscribers = NewsletterSubscriber::whereNull('unsubscribed_at')
            ->where('language', $language)
            ->get();

        foreach ($subscribers as $subscriber) {
            Mail::to($subscriber->email)->send(
                new NewsletterMail($title, $content)
            );
        }

        return response()->json(['message' => 'Emails sent successfully'], 200);
    }
}