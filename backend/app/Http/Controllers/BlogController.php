<?php

namespace App\Http\Controllers;
require_once app_path('Models/Models.php');
use App\Models\BlogPost;
use Illuminate\Http\Request;


class BlogController extends Controller
{
    /**
     * GET /api/blog
     * Supports: ?search=, ?limit=
     */
    public function index(Request $request)
    {
        $query = BlogPost::query()
            ->orderByDesc("published_at");

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title',   'ilike', '%' . $request->search . '%')
                ->orWhere('content', 'ilike', '%' . $request->search . '%'); // replaces excerpt
            });
        }

        $limit = min((int) $request->get('limit', 10), 50);
        return response()->json($query->paginate($limit));
    }

    /**
     * GET /api/blog/{post}
     */
    public function show(BlogPost $post)
    {
        return response()->json($post);
    }
}
