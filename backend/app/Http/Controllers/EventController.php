<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * GET /api/events
     * Supports: ?search=, ?category=, ?date_from=, ?date_to=, ?limit=
     */
    public function index(Request $request)
    {
        $query = Event::query()->where('is_published', true);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title',       'ilike', '%' . $request->search . '%')
                  ->orWhere('description','ilike', '%' . $request->search . '%');
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('start_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('start_date', '<=', $request->date_to);
        }

        $query->orderBy('start_date');

        $limit = min((int) $request->get('limit', 20), 100);

        return response()->json($query->paginate($limit));
    }

    /**
     * GET /api/events/{event}
     */
    public function show(Event $event)
    {
        // Append computed spots_left attribute
        $event->loadCount('registrations');
        $event->spots_left = $event->capacity
            ? max(0, $event->capacity - $event->registrations_count)
            : null;

        return response()->json($event);
    }

    /**
     * POST /api/events/{event}/register   [auth required]
     */
    public function register(Request $request, Event $event)
    {
        $validated = $request->validate([
            'quantity'             => 'required|integer|min:1|max:10',
            'subscribe_recurring'  => 'nullable|boolean',
        ]);

        // Check availability
        if ($event->capacity) {
            $taken = EventRegistration::where('event_id', $event->id)->sum('quantity');
            if (($taken + $validated['quantity']) > $event->capacity) {
                return response()->json(['message' => 'Not enough spots available.'], 422);
            }
        }

        // TODO: Process payment via Stripe before creating registration

        $registration = EventRegistration::create([
            'user_id'              => $request->user()->id,
            'event_id'             => $event->id,
            'quantity'             => $validated['quantity'],
            'status'               => 'confirmed',
            'subscribe_recurring'  => $validated['subscribe_recurring'] ?? false,
            'amount_paid'          => $event->price * $validated['quantity'],
        ]);

        return response()->json($registration, 201);
    }
}
