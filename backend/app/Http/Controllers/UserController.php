<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * GET /api/user
     */
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * PUT /api/user/profile
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $request->user()->id,
        ]);

        $request->user()->update($validated);

        return response()->json($request->user()->fresh());
    }

    /**
     * POST /api/user/membership/renew
     * Stub — wire up Stripe for real payment.
     */
    public function renewMembership(Request $request)
    {
        // TODO: charge membership fee via Stripe
        $user = $request->user();
        $user->update([
            'membership_status'     => 'active',
            'membership_expires_at' => now()->addYear(),
        ]);

        return response()->json(['message' => 'Membership renewed until ' . $user->membership_expires_at->toDateString()]);
    }

    /**
     * GET /api/user/registrations
     */
    public function registrations(Request $request)
    {
        $registrations = $request->user()
            ->eventRegistrations()
            ->with('event:id,title,start_date,location')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($registrations);
    }

    /**
     * GET /api/user/donations
     */
    public function donations(Request $request)
    {
        $donations = $request->user()
            ->donations()
            ->orderByDesc('created_at')
            ->get();

        return response()->json($donations);
    }
}
