<?php

namespace App\Http\Controllers;

use App\Models\Production;
use Illuminate\Http\Request;

class ProductionController extends Controller
{
    /**
     * GET /api/productions
     */
    public function index(Request $request)
    {
        $query = Production::query()
            ->where('is_published', true)
            ->orderByDesc('year');

        if ($request->filled('search')) {
            $query->where('title', 'ilike', '%' . $request->search . '%');
        }

        return response()->json($query->paginate(12));
    }

    /**
     * GET /api/productions/{production}
     */
    public function show(Production $production)
    {
        return response()->json($production);
    }
}
