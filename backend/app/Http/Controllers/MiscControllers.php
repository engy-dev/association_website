<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use App\Models\VolunteerApplication;
use Illuminate\Http\Request;


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
