<?php

namespace App\Http\Controllers\Dashboard;


use App\Models\Collection;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class CollectionController extends Controller
{
    public function index()
    {
        $collections = Collection::with(['user:id,name,avatar', 'books', 'resources'])->get();
        
        return Inertia::render('Collections/collections-index', [
            'collections' => $collections
        ]);
    }

    public function show(Collection $collection)
    {
        $collection->load(['user:id,name,avatar', 'books', 'resources']);
        
        return Inertia::render('Collections/collection-show', [
            'collection' => $collection
        ]);
    }
}