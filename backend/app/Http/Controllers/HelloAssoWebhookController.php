<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HelloAssoWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->json()->all();

        // eventType can be 'Payment' or 'Order'
        $eventType = $payload['eventType'] ?? null;
        $metadata  = $payload['metadata']  ?? [];


        if ($eventType === 'Order') {
            $userId   = $metadata['user_id']  ?? null;
            $eventId  = $metadata['event_id'] ?? null;
            $quantity = $metadata['quantity'] ?? 1;

            // ✅ Payment confirmed server-to-server.
            // Here you can: send a confirmation email, update a registrations table,
            // decrement a counter, etc. For now we just log it.
            Log::info("Confirmed registration: user {$userId} → event {$eventId} x{$quantity}");
        }

        return response()->json(['ok' => true]);
    }
}