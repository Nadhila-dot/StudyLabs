<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use App\Models\Resource; //
use App\Models\Collection;


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
        $collections = Collection::with(['user', 'books', 'resources'])->get();
        $resources = Resource::all();
        $books = Book::all();
        
        return Inertia::render('dashboard', [
            'collections' => $collections,
            'resources' => $resources,
            'books' => $books
        ]);
    }


    public function users($name)
    {
        try {
            // URL decode the name parameter
            $decodedName = urldecode($name);
            
            // Try to find the user by exact name match
            $user = User::where('name', $decodedName)->first();
            
            // If exact match not found, try fuzzy matching
            if (!$user) {
                // Try case-insensitive search
                $user = User::whereRaw('LOWER(name) = ?', [strtolower($decodedName)])->first();
                
                // If still not found, try partial match
                if (!$user) {
                    // Get similar users based on name similarity
                    $similarUsers = User::whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($decodedName) . '%'])
                        ->orWhereRaw('LOWER(name) LIKE ?', ['%' . strtolower(str_replace(' ', '%', $decodedName)) . '%'])
                        ->limit(5)
                        ->get();
                    
                    if ($similarUsers->isNotEmpty()) {
                        // Sort by name similarity (closest match first)
                        $sortedUsers = $similarUsers->sortBy(function ($user) use ($decodedName) {
                            return levenshtein(strtolower($user->name), strtolower($decodedName));
                        });
                        
                        // Take the closest match
                        $user = $sortedUsers->first();
                        
                        // Log that we're using a similar match
                        \Log::info("User '{$decodedName}' not found exactly, using closest match: '{$user->name}'");
                    } else {
                        return Inertia::render('Errors/404', [
                            'message' => 'User not found',
                            'type' => 'user',
                            'suggestions' => User::limit(5)->get(['id', 'name']), // Suggest some users to explore
                        ])->status(404);
                    }
                }
            }
            
            // Get collections directly from the Collection model by user_id
            $collections = Collection::where('user_id', $user->id)
                ->orderByDesc('created_at')
                ->limit(5)
                ->with('resources') // Eager load resources to avoid N+1
                ->get()
                ->map(function($collection) {
                    return [
                        'id' => $collection->id,
                        'name' => $collection->name,
                        'description' => $collection->description,
                        'subject' => $collection->subject,
                        'section' => $collection->section,
                        'created_at' => $collection->created_at->format('M d, Y'),
                        'resource_count' => $collection->resources->count(),
                    ];
                });
                
            // Define the data we want to send to the frontend
            $userData = [
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar ?? null,
                'banner' => $user->banner ?? null,
                'level' => $user->level ?? 1,
                'description' => $user->description ?? '',
                'is_admin' => $user->is_admin ?? false,
                'is_team' => $user->is_team ?? false,
                'member_since' => $user->created_at->format('F Y'),
                'collections' => $collections,
            ];
            
            // Check if user has posts relationship and add if exists
            if (method_exists($user, 'posts')) {
                $userData['posts'] = $user->posts()
                    ->where('published', true)
                    ->orderByDesc('created_at')
                    ->limit(3)
                    ->get()
                    ->map(function($post) {
                        return [
                            'id' => $post->id,
                            'title' => $post->title,
                            'slug' => $post->slug,
                            'excerpt' => $post->excerpt ?? substr(strip_tags($post->content), 0, 100) . '...',
                            'published_at' => $post->published_at->format('M d, Y'),
                        ];
                    });
            }
            
            return Inertia::render('Users/users-index', [
                'user' => $userData,
                'exactMatch' => $user->name === $decodedName, // Send whether this is an exact match
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in users profile: ' . $e->getMessage());
            return Inertia::render('Errors/404', [
                'message' => 'User not found',
                'type' => 'user',
            ])->status(404);
        }
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