<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the posts.
     */
    public function index()
    {
        $posts = Post::with('user')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('admin/Posts/Postsview', [
            'posts' => $posts
        ]);
    }

    /**
     * Show the form for creating a new post.
     */
    public function create()
    {
        return Inertia::render('Admin/Posts/PostForm');
    }

    /**
     * Store a newly created post in storage.
     */
    
    /**
     * Store a newly created post in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'featured_image' => 'nullable|string', // Changed from 'image' to 'string' to accept base64
            'published' => 'boolean',
        ]);

        $post = new Post();
        $post->title = $validated['title'];
        
        // Generate a unique slug
        $baseSlug = Str::slug($validated['title']);
        $slug = $baseSlug;
        $counter = 1;
        
        // Check if the slug exists and append a number until it's unique
        while (Post::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }
        
        $post->slug = $slug;
        $post->content = $validated['content'];
        $post->excerpt = $validated['excerpt'] ?? Str::limit(strip_tags($validated['content']), 150);
        $post->published = $validated['published'] ?? false;
        
        if ($validated['published'] && !$post->published_at) {
            $post->published_at = now();
        }

        // Handle the featured image as a string (can be a base64 encoded image)
        if (!empty($validated['featured_image'])) {
            $post->featured_image = $validated['featured_image'];
        }

        $post->user_id = auth()->id();
        $post->save();

        return redirect()->route('admin.posts.index');
    }

    /**
     * Show the form for editing the specified post.
     */
    public function edit(Post $post)
    {
        return Inertia::render('Admin/Posts/PostForm', [
            'post' => $post
        ]);
    }

    /**
     * Update the specified post in storage.
     */
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'featured_image' => 'nullable|image|max:2048',
            'published' => 'boolean',
        ]);

        $post->title = $validated['title'];
        
        // Only update slug if title changed
        if ($post->isDirty('title')) {
            $post->slug = Str::slug($validated['title']);
        }
        
        $post->content = $validated['content'];
        $post->excerpt = $validated['excerpt'] ?? Str::limit(strip_tags($validated['content']), 150);
        
        // Set published_at if published for the first time
        if ($validated['published'] && !$post->published && !$post->published_at) {
            $post->published_at = now();
        }
        
        $post->published = $validated['published'] ?? false;

        if ($request->hasFile('featured_image')) {
            $file = $request->file('featured_image');
            $imageData = file_get_contents($file->getPathname());
            $base64Image = 'data:' . $file->getClientMimeType() . ';base64,' . base64_encode($imageData);
            $post->featured_image = $base64Image;
        }

        $post->save();

        return redirect()->route('admin.posts.index');
    }

    /**
     * Remove the specified post from storage.
     */
    public function destroy(Post $post)
    {
        $post->delete();
        
        return redirect()->route('admin.posts.index');
    }
}