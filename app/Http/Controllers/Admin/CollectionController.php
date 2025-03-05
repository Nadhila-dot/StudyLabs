<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Models\Book;
use App\Models\Resource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CollectionController extends Controller
{
    /**
     * Display a listing of the collections.
     */
    
    public function index()
    {
        $collections = Collection::all();
        $books = Book::all();
        $resources = Resource::all();
        
        return Inertia::render('admin/Collections/Collectionsview', [
            'collections' => $collections,
            'books' => $books,
            'resources' => $resources
        ]);
    }

    /**
     * Show the form for creating a new collection.
     */
    public function create()
    {
        $books = Book::all();
        $resources = Resource::all();
        
        return Inertia::render('admin/Collections/Create', [
            'books' => $books,
            'resources' => $resources
        ]);
    }

    /**
     * Store a newly created collection in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'subject' => 'required|string|max:255',
            'section' => 'required|in:IGCSE,IAL,IB,SAT',
            'books' => 'nullable|array',
            'resources' => 'nullable|array',
        ]);

        $collection = Collection::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'subject' => $validated['subject'],
            'section' => $validated['section'],
            'user_id' => auth()->id(),
        ]);

        if (isset($validated['books'])) {
            $collection->books()->attach($validated['books']);
        }

        if (isset($validated['resources'])) {
            $collection->resources()->attach($validated['resources']);
        }

        return redirect()->route('admin.collections.index')
            ->with('message', 'Collection created successfully.');
    }

    /**
     * Show the form for editing the specified collection.
     */
    public function edit(Collection $collection)
    {
        $collection->load(['books', 'resources']);
        $books = Book::all();
        $resources = Resource::all();
        
        return Inertia::render('Admin/Collections/Edit', [
            'collection' => $collection,
            'books' => $books,
            'resources' => $resources
        ]);
    }

    /**
     * Update the specified collection in storage.
     */
    public function update(Request $request, Collection $collection)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'subject' => 'required|string|max:255',
            'section' => 'required|in:IGCSE,IAL,IB,SAT',
            'books' => 'nullable|array',
            'resources' => 'nullable|array',
        ]);

        $collection->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'subject' => $validated['subject'],
            'section' => $validated['section'],
        ]);

        // Sync relationships
        $collection->books()->sync($validated['books'] ?? []);
        $collection->resources()->sync($validated['resources'] ?? []);

        return redirect()->route('admin.collections.index')
            ->with('message', 'Collection updated successfully.');
    }

    /**
     * Remove the specified collection from storage.
     */
    public function destroy(Collection $collection)
    {
        $collection->delete();
        
        return redirect()->route('admin.collections.index')
            ->with('message', 'Collection deleted successfully.');
    }
}