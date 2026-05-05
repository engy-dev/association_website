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
        $lang  = $request->header('Accept-Language', 'fr');
        $lang  = in_array($lang, ['en', 'fr', 'ar']) ? $lang : 'fr';

        $titleCol    = "title_{$lang}";
        $descCol     = "description_{$lang}";
        $categoryCol = "category_{$lang}";

        $query = Event::query()->select([
            'id', 'organizer_id',
            "{$titleCol}    as title",
            "{$descCol}     as description",
            "{$categoryCol} as category",
            'start_datetime', 'end_datetime',
            'location', 'cost', 'capacity', 'is_full', 'is_recurring',
        ]);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request, $titleCol, $descCol) {
                $q->where($titleCol, 'ilike', '%' . $request->search . '%')
                ->orWhere($descCol, 'ilike', '%' . $request->search . '%');
            });
        }

        if ($request->filled('category')) {
            $query->where($categoryCol, $request->category);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('start_datetime', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('start_datetime', '<=', $request->date_to);
        }

        $query->orderBy('start_datetime');

        $limit = min((int) $request->get('limit', 20), 100);

        return response()->json($query->paginate($limit));
    }

    /**
     * GET /api/events/{event}
     */
    public function show(Request $request, Event $event)
    {
        $lang = $request->header('Accept-Language', 'fr');
        $lang = in_array($lang, ['en', 'fr', 'ar']) ? $lang : 'fr';

        $event->loadCount('registrations');
        $event->spots_left = $event->capacity
            ? max(0, $event->capacity - $event->registrations_count)
            : null;

        $event->title       = $event->{"title_{$lang}"};
        $event->description = $event->{"description_{$lang}"};
        $event->category    = $event->{"category_{$lang}"};

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
            'amount_paid'          => $event->cost * $validated['quantity'],
        ]);

        return response()->json($registration, 201);
    }

    /**
     * GET /api/events/categories
     * Returns distinct categories in the requested language.
     */
    public function categories(Request $request)
    {
        $lang = $request->header('Accept-Language', 'fr');
        $lang = in_array($lang, ['en', 'fr', 'ar']) ? $lang : 'fr';

        $col = "category_{$lang}";

        $categories = Event::query()
            ->whereNotNull($col)
            ->where($col, '!=', '')
            ->distinct()
            ->orderBy($col)
            ->pluck($col)
            ->values();

        return response()->json($categories);
    }
}
