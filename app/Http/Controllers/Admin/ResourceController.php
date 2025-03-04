<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResourceController extends Controller
{
    /**
     * Display a listing of the resources.
     */
    public function index()
    {
        $resources = Resource::with('user')->latest()->paginate(10);
        $categories = ['Notes', 'Past Papers', 'Tutes', 'Worksheets', 'Presentations', 'Videos', 'Other'];
        
        return Inertia::render('admin/Resources/Resourcesview', [
            'resources' => $resources,
            'categories' => $categories
        ]);
    }

    /**
     * Store a new resource.
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
        
        // Set subject to null if it's 'none'
        if ($validated['subject'] === 'none') {
            $validated['subject'] = null;
        }
        
        Resource::create([
            ...$validated,
            'user_id' => auth()->id()
        ]);
        
        return redirect()->route('admin.resources')
            ->with('success', 'Resource created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $resource = Resource::findOrFail($id);
        $categories = ['Notes', 'Past Papers', 'Tutes', 'Worksheets', 'Presentations', 'Videos', 'Other'];
        
        return Inertia::render('admin/Resources/Edit', [
            'resource' => $resource,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified resource.
     */
    public function update(Request $request, $id)
    {
        $resource = Resource::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'preview_url' => 'required|url',
            'subject' => 'nullable|string|max:100',
            'term' => 'nullable|string|max:100',
            'category' => 'required|string|max:100',
            'etc' => 'nullable|array',
        ]);
        
        // Set subject to null if it's 'none'
        if ($validated['subject'] === 'none') {
            $validated['subject'] = null;
        }
        
        $resource->update($validated);
        
        return redirect()->route('admin.resources')
            ->with('success', 'Resource updated successfully.');
    }

    /**
     * Remove the specified resource.
     */
    public function destroy($id)
    {
        $resource = Resource::findOrFail($id);
        $resource->delete();
        
        return redirect()->route('admin.resources')
            ->with('success', 'Resource deleted successfully.');
    }
}