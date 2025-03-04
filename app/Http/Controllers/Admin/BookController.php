<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class BookController extends Controller
{
    /**
     * Display a listing of books.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $filter = $request->input('filter');
        
        $query = Book::query();
        
        // Apply search if provided
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('book_name', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }
        
        // Apply category filter if provided
        if ($filter) {
            $query->where('category', $filter);
        }
        
        $books = $query->latest()->paginate(10)->withQueryString();
        $categories = Book::select('category')->distinct()->pluck('category');
        
        return Inertia::render('admin/Books/Booksview', [
            'books' => $books,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'filter' => $filter
            ]
        ]);
    }

    /**
     * Store a newly created book.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'book_name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'url' => 'required|url|max:2000',
            'category' => 'required|string|max:255',
        ]);
        
        Book::create($validated);
        
        return redirect()->route('admin.books.index')
            ->with('success', 'Book added successfully!');
    }

    /**
     * Show the form for editing the specified book.
     */
    public function edit(Book $book)
    {
        $categories = Book::select('category')->distinct()->pluck('category');
        
        return Inertia::render('admin/Books/Edit', [
            'book' => $book,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified book.
     */
    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'book_name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'url' => 'required|url|max:2000',
            'category' => 'required|string|max:255',
        ]);
        
        $book->update($validated);
        
        return redirect()->route('admin.books.index')
            ->with('success', 'Book updated successfully!');
    }

    /**
     * Remove the specified book.
     */
    public function destroy(Book $book)
    {
        $book->delete();
        
        return redirect()->route('admin.books.index')
            ->with('success', 'Book deleted successfully!');
    }
}