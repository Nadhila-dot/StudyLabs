<?php

namespace App\Http\Controllers\Dashboard;

use App\Models\Resource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResourceController extends Controller
{
    /**
     * Display a listing of the user's resources.
     */
    public function index()
    {
        $resources = Resource::where('user_id', auth()->id())
            ->latest()
            ->paginate(10);
        
        return Inertia::render('Resources/Index', [
            'resources' => $resources
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Resources/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'preview_url' => 'required|url',
            'subject' => 'nullable|string|max:100',
            'term' => 'nullable|string|max:100',
            'category' => 'required|string|max:100',
            'etc' => 'nullable|array',
        ]);
        
        Resource::create([
            ...$validated,
            'user_id' => auth()->id()
        ]);
        
        return redirect()->route('resources.index')
            ->with('success', 'Resource created successfully.');
    }
}