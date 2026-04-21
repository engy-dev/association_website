<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\NewsletterSubscriber;
use App\Models\VolunteerApplication;
use Illuminate\Http\Request;

// ─── Contact ─────────────────────────────────────────────────────────────────

class ContactController extends Controller
{
    /**
     * POST /api/contact
     */
    public function send(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        ContactMessage::create($validated);

        // TODO: Send notification email to admin
        // Mail::to(config('mail.admin'))->send(new ContactReceived($validated));

        return response()->json(['message' => 'Message received. Thank you!']);
    }
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

class NewsletterController extends Controller
{
    /**
     * POST /api/newsletter
     */
    public function subscribe(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        NewsletterSubscriber::firstOrCreate(['email' => $request->email]);

        return response()->json(['message' => 'Subscribed!']);
    }
}

// ─── Volunteer ────────────────────────────────────────────────────────────────

class VolunteerController extends Controller
{
    /**
     * POST /api/volunteer
     */
    public function apply(Request $request)
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|email',
            'phone'        => 'nullable|string|max:30',
            'availability' => 'nullable|string',
            'motivation'   => 'nullable|string',
        ]);

        VolunteerApplication::create($validated);

        return response()->json(['message' => 'Application received. We will be in touch!'], 201);
    }
}
