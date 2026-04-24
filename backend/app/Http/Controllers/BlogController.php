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
    $lang = $this->getLocale(); // 'fr', 'en', or 'ar'

    $query = BlogPost::query()
        ->orderByDesc("published_at");

    if ($request->filled('search')) {
        $query->where(function ($q) use ($request, $lang) {
            $q->where("title_{$lang}",   'ilike', '%' . $request->search . '%')
              ->orWhere("content_{$lang}", 'ilike', '%' . $request->search . '%');
        });
    }

    $limit = min((int) $request->get('limit', 10), 50);

    // Map each post to expose only the active language's colum using the generic keys for frontend compatibility
    $paginated = $query->paginate($limit);
    $paginated->getCollection()->transform(fn($post) => [
        'id'           => $post->id,
        'title'        => $post->{"title_{$lang}"},
        'content'      => $post->{"content_{$lang}"},
        'author_name'  => $post->author_name,
        'status'       => $post->status,
        'published_at' => $post->published_at,
    ]);

    return response()->json($paginated);
}

    /**
     * GET /api/blog/{post}
     */
    public function show(BlogPost $post)
    {
        $lang = $this->getLocale();

        return response()->json([
            'id'           => $post->id,
            'title'        => $post->{"title_{$lang}"},
            'content'      => $post->{"content_{$lang}"},
            'author_name'  => $post->author_name,
            'status'       => $post->status,
            'published_at' => $post->published_at,
        ]);
    }
}
