<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends Controller
{
    /**
     * Display a listing of news posts.
     */
    public function index()
    {
        $posts = Post::with('user')
            ->where('published', true)
            ->orderByDesc('published_at')
            ->get();

        return Inertia::render('News/news-index', [
            'posts' => $posts
        ]);
    }

    /**
     * Display the specified news post.
     */
    public function show($slug)
    {
        $post = Post::with('user')
            ->where('slug', $slug)
            ->where('published', true)
            ->firstOrFail();

        return Inertia::render('News/news-show', [
            'post' => $post
        ]);
    }
}