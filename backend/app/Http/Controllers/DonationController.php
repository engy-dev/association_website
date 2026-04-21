<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    /**
     * POST /api/donations
     * Accepts both guest and authenticated donors.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount'    => 'required|numeric|min:1',
            'frequency' => 'required|in:once,monthly',
            'name'      => 'nullable|string|max:255',
            'email'     => 'required_if:anonymous,false|nullable|email',
            'anonymous' => 'nullable|boolean',
        ]);

        // TODO: Process payment via HelloAsso
        // $paymentIntent = \HelloAsso\PaymentIntent::create([...]);
        // Store $paymentIntent->id as helloasso_payment_id

        $donation = Donation::create([
            'user_id'           => $request->user()?->id,   // null if guest
            'amount'            => $validated['amount'],
            'frequency'         => $validated['frequency'],
            'donor_name'        => $validated['anonymous'] ? null : ($validated['name'] ?? null),
            'donor_email'       => $validated['anonymous'] ? null : ($validated['email'] ?? null),
            'anonymous'         => $validated['anonymous'] ?? false,
            'helloasso_payment_id' => null,   // fill after HelloAsso integration
            'receipt_url'       => null,   // generate PDF receipt after payment
        ]);

        return response()->json($donation, 201);
    }
}
