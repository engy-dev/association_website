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
    public function store(Request $request, \App\Services\HelloAssoService $helloasso)
    {
        $validated = $request->validate([
            'amount'    => 'required|integer|min:1',
            'frequency' => 'required|in:once,monthly',
            'name'      => 'nullable|string|max:255',
            'email'     => 'nullable|email',
        ]);

        $amountCents = (int) $validated['amount'] * 100;
        $name  = isset($validated['name'])  ? trim($validated['name'])  : null;
        $email = isset($validated['email']) ? $validated['email']        : null;

        // Split name into first/last for HelloAsso payer object
        $nameParts = $name ? explode(' ', $name, 2) : [];
        $firstName = $nameParts[0] ?? '';
        $lastName  = $nameParts[1] ?? '';

        $payload = [
            'totalAmount'      => $amountCents,
            'initialAmount'    => $amountCents,
            'itemName'         => 'Don à l\'association',
            'backUrl'          => config('app.frontend_url') . '/donate',
            'errorUrl'         => config('app.frontend_url') . '/donate?status=error',
            'returnUrl'        => config('app.frontend_url') . '/donate?status=success',
            'containsDonation' => true,
            'metadata'         => [
                'frequency' => $validated['frequency'],
                'user_id'   => $request->user()?->id,
            ],
        ];

        // Add payer info only when values are non-empty
        if ($firstName || $lastName || $email) {
            $payload['payer'] = array_filter([
                'firstName' => $firstName,
                'lastName'  => $lastName,
                'email'     => $email,
            ]);
        }

        // Monthly: schedule 11 future installments (months 2–12), same amount each
        if ($validated['frequency'] === 'monthly') {
            $terms = [];
            for ($i = 1; $i <= 11; $i++) {
                $terms[] = [
                    'amount' => $amountCents,
                    'date'   => now()->addMonths($i)->startOfMonth()->format('Y-m-d'),
                ];
            }
            // totalAmount = initial + 11 terms
            $payload['totalAmount'] = $amountCents * 12;
            $payload['terms']       = $terms;
        }

        $result = $helloasso->createCheckoutIntent($payload);

        return response()->json([
            'redirectUrl'      => $result['redirectUrl'],
            'checkoutIntentId' => $result['id'],
        ], 201);
    }
}
