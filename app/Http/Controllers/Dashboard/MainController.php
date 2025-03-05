<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;
use Illuminate\Support\Facades\Http;
use App\Models\Resource; //

use Inertia\Inertia;

class MainController extends Controller
{
    /**
     * Display the welcome page.
     */
    public function welcome()
    {
        return Inertia::render('welcome');
    }

    /**
     * Display the dashboard.
     */
    

     

     public function resources()
     {
         $resources = Resource::query()
             ->latest()
             ->paginate(10);
     
         return Inertia::render('resources/resources-index', [
             'resources' => $resources
         ]);
     }

    /**
     * Display the dashboard.
     */
    public function dashboard()
    {
        return Inertia::render('dashboard');
    }
    /**
     * Display Courses for User - > [Take which specificiation]
     */

    public function courses()
    {
        return Inertia::render('courses/courses-index');
    }

    /**
     * Display Support for User - > [Take which specificiation]
     */

     public function support()
     {
         return Inertia::render('Support/support-index');
     }

    
    /**
     * Display a listing of the books. (It queries the DB to the get all of it)
     */
    public function books(Request $request)
    {
        // Get filter parameters
        $category = $request->query('category');
        $search = $request->query('search');
        
        // Build the query
        $query = Book::query();
        
        // Apply category filter if provided
        if ($category) {
            $query->where('category', $category);
        }
        
        // Apply search if provided
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('book_name', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%");
            });
        }
        
        // Get books and categories
        $books = $query->latest()->get();
        $categories = Book::select('category')->distinct()->pluck('category');
        
        // Transform the books to match the expected format
        $formattedBooks = $books->map(function($book) {
            return [
                'id' => $book->id,
                'title' => $book->book_name,
                'author' => $book->subject ?? 'Unknown',
                'description' => 'Educational resource for ' . $book->subject,
                'coverImage' => null,
                'rating' => null,
                'downloadUrl' => $book->url,
                'subject' => $book->subject,
                'category' => $book->category
            ];
        });
        
        return Inertia::render('books/books-index', [
            'books' => $formattedBooks,
            'categories' => $categories,
            'filters' => [
                'category' => $category,
                'search' => $search
            ],
            'isLoading' => false
        ]);
    }
    

    /**
     * Show the form for creating a new resource.
     */
    public function redirect(string $name, string $url)
    {
        // URL decode parameters
        $decodedName = urldecode($name);
        $decodedUrl = urldecode($url);
        
        // Validate the URL
        if (!filter_var($decodedUrl, FILTER_VALIDATE_URL)) {
            abort(400, 'Invalid URL');
        }
        
        // You might want to log this redirect for analytics
        // \Log::info('Book download redirect', ['name' => $decodedName, 'url' => $decodedUrl]);
        
        return Inertia::render('books/books-redirect', [
            'book' => [
                'name' => $decodedName,
                'url' => $decodedUrl,
            ],
            'type' => [
                'reason' => 'External Book Download File',
                
            ]
            
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }
}