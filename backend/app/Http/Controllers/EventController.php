<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Services\HelloAssoService;
use Illuminate\Http\Request;
use Log;

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
            'title_en', 'title_fr', 'title_ar',
            'description_en', 'description_fr', 'description_ar',
            'category_en', 'category_fr', 'category_ar',
            'start_datetime', 'end_datetime',
            'location', 'min_cost', 'max_cost', 'capacity', 'is_full', 'is_recurring',
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
        $event->spots_left = $event->capacity
            ? max(0, $event->capacity - $event->registrations_count)
            : null;

        return response()->json($event);
    }

    /**
     * POST /api/events/{event}/checkout-intent   [auth required]
     * Creates a HelloAsso checkout intent and returns the redirectUrl.
     */
    public function checkoutIntent(Request $request, Event $event, HelloAssoService $helloasso)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1|max:10',
            'tier_id'  => 'required|integer',
            'tier_label' => 'required|string|max:250',
            'amount_cents' => 'required|integer|min:0',
        ]);

        if (!$event->helloasso_event_slug) {
            return response()->json(['message' => 'Event not linked to HelloAsso.'], 422);
        }

        $user       = $request->user();
        $amountCents = $validated['amount_cents'] * $validated['quantity'];

        $payload = [
            'totalAmount'      => $amountCents,
            'initialAmount'    => $amountCents,
            'itemName'         => $validated['tier_label'] . ($validated['quantity'] > 1 ? " x{$validated['quantity']}" : ''),
            'backUrl'          => config('app.frontend_url') . "/events/{$event->id}",
            'errorUrl'         => config('app.frontend_url') . "/events/{$event->id}/checkout-return?status=error",
            'returnUrl'        => config('app.frontend_url') . "/events/{$event->id}/checkout-return?status=success",
            'containsDonation' => false,
            'payer' => [
                'firstName' => $user->first_name ?? '',
                'lastName'  => $user->last_name  ?? '',
                'email'     => $user->email,
            ],
            'metadata' => [
                'user_id'  => $user->id,
                'event_id' => $event->id,
                'tier_id'  => $validated['tier_id'],
                'quantity' => $validated['quantity'],
            ],
        ];

        $result = $helloasso->createCheckoutIntent($payload);

        return response()->json([
            'redirectUrl'       => $result['redirectUrl'],
            'checkoutIntentId'  => $result['id'],
        ]);
    }

    /**
     * GET /api/events/{event}/widget
     * Returns the HelloAsso widget embed URL for this event.
     */
    public function widget(Request $request, Event $event)
    {
        if (!$event->helloasso_event_slug) {
            return response()->json(['message' => 'Event not linked to HelloAsso.'], 422);
        }

        $orgSlug   = config('services.helloasso.org_slug');
        $baseUrl   = config('services.helloasso.widget_base_url', 'https://www.helloasso-sandbox.com');
        $widgetUrl = "{$baseUrl}/associations/{$orgSlug}/evenements/{$event->helloasso_event_slug}/widget";

        return response()->json(['widgetUrl' => $widgetUrl]);
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
