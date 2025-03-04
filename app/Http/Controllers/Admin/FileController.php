<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;
use Exception;

class FileController extends Controller
{
    /**
     * Display a listing of the files.
     */
    public function index(): Response
    {
        try {
            $files = collect(Storage::disk('public')->files('uploads'))
                ->map(function ($file) {
                    try {
                        return [
                            'name' => basename($file),
                            'path' => $file,
                            'url' => asset('storage/' . $file),
                            'size' => Storage::disk('public')->size($file),
                            'last_modified' => Storage::disk('public')->lastModified($file),
                            'type' => $this->getFileType(Storage::disk('public')->mimeType($file))
                        ];
                    } catch (Exception $e) {
                        Log::error("Error processing file {$file}: " . $e->getMessage());
                        return null;
                    }
                })
                ->filter()
                ->sortByDesc('last_modified')
                ->values();

            return Inertia::render('admin/Files/Fileview', [
                'files' => $files
            ]);
        } catch (Exception $e) {
            Log::error("Error listing files: " . $e->getMessage());
            return Inertia::render('admin/Files/Fileview', [
                'files' => [],
                'error' => 'Failed to load files. Please check server logs.'
            ]);
        }
    }

    /**
     * Store a newly uploaded file.
     */
    public function store(Request $request)
    {
        // Increase memory limit temporarily for large file processing
        ini_set('memory_limit', '512M');
        
        // Modify validation to increase PDF file size limit (100MB for PDFs, 20MB for other types)
        try {
            $validator = validator($request->all(), [
                'file' => [
                    'required',
                    'file',
                    function ($attribute, $value, $fail) {
                        $mimeType = $value->getMimeType();
                        
                        // Allow PDFs up to 100MB
                        if ($mimeType === 'application/pdf') {
                            $maxSize = 100 * 1024; // 100MB in KB
                            if ($value->getSize() / 1024 > $maxSize) {
                                $fail("The PDF file may not be greater than 100MB.");
                            }
                        } 
                        // Allow images up to 20MB
                        elseif (Str::startsWith($mimeType, 'image/')) {
                            $maxSize = 20 * 1024; // 20MB in KB
                            if ($value->getSize() / 1024 > $maxSize) {
                                $fail("The image file may not be greater than 20MB.");
                            }
                        }
                        // Allow text documents up to 30MB
                        elseif (Str::startsWith($mimeType, 'text/') || 
                                in_array($mimeType, [
                                    'application/msword',
                                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                ])) {
                            $maxSize = 30 * 1024; // 30MB in KB
                            if ($value->getSize() / 1024 > $maxSize) {
                                $fail("The document file may not be greater than 30MB.");
                            }
                        }
                        // Reject other file types
                        else {
                            $fail("The file must be an image, PDF, or document.");
                        }
                    },
                ],
            ]);

            if ($validator->fails()) {
                return back()->withErrors($validator);
            }

            $file = $request->file('file');
            $filename = $this->generateUniqueFilename($file->getClientOriginalName());
            
            // Create uploads directory if it doesn't exist
            if (!Storage::disk('public')->exists('uploads')) {
                Storage::disk('public')->makeDirectory('uploads');
            }
            
            // Store file with optimized settings
            $path = $file->storeAs('uploads', $filename, 'public');
            
            if (!$path) {
                return redirect()->route('admin.files.index')->with('error', 'Failed to upload file. Please try again.');
            }

            return redirect()->route('admin.files.index')->with('success', 'File uploaded successfully!');
        } catch (Exception $e) {
            Log::error("File upload error: " . $e->getMessage());
            return redirect()->route('admin.files.index')->with('error', 'An error occurred during upload: ' . $e->getMessage());
        } finally {
            // Reset memory limit to default
            ini_set('memory_limit', '128M');
        }
    }

    /**
     * Display the specified file.
     */
    /**
 * Display the specified file.
 */
public function show($filename)
{
    $path = 'uploads/' . $filename;

    try {
        if (!Storage::disk('public')->exists($path)) {
            abort(404);
        }

        $mimeType = Storage::disk('public')->mimeType($path);
        $file = storage_path('app/public/' . $path);
        
        // For PDFs and images, serve directly
        if ($mimeType === 'application/pdf' || Str::startsWith($mimeType, 'image/')) {
            return response()->file($file, [
                'Content-Type' => $mimeType,
                'Content-Disposition' => 'inline; filename="' . $filename . '"',
                'Cache-Control' => 'public, max-age=86400'
            ]);
        }
        
        // For text files, display content
        if (Str::startsWith($mimeType, 'text/') || in_array($mimeType, [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ])) {
            $content = Storage::disk('public')->get($path);
            return response($content, 200, [
                'Content-Type' => $mimeType,
                'Content-Disposition' => 'inline; filename="' . $filename . '"',
                'Cache-Control' => 'public, max-age=86400'
            ]);
        }

        // For unsupported types, force download
        return Storage::disk('public')->download($path);
        
    } catch (Exception $e) {
        Log::error("Error serving file {$filename}: " . $e->getMessage());
        abort(500, 'Error serving the requested file');
    }
}

    /**
     * Remove the specified file.
     */
    public function destroy($filename)
    {
        try {
            $path = 'uploads/' . $filename;

            if (!Storage::disk('public')->exists($path)) {
                return redirect()->back()->with('error', 'File not found.');
            }

            Storage::disk('public')->delete($path);

            return redirect()->route('admin.files.index')->with('success', 'File deleted successfully!');
        } catch (Exception $e) {
            Log::error("Error deleting file {$filename}: " . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete file: ' . $e->getMessage());
        }
    }

    /**
     * Display a preview page for the file.
     */
    public function preview($filename)
    {
        $path = 'uploads/' . $filename;

        if (!Storage::disk('public')->exists($path)) {
            abort(404);
        }

        $mimeType = Storage::disk('public')->mimeType($path);
        
        $file = [
            'name' => $filename,
            'path' => $path,
            'url' => asset('storage/' . $path),
            'size' => Storage::disk('public')->size($path),
            'last_modified' => Storage::disk('public')->lastModified($path),
            'type' => $this->getFileType($mimeType)
        ];
        
        return Inertia::render('admin/Files/secure-pdf', [
            'file' => $file
        ]);
    }

    /**
     * Generate a unique filename to prevent overwrites.
     */
    private function generateUniqueFilename($originalName)
    {
        $filename = pathinfo($originalName, PATHINFO_FILENAME);
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);
        
        // Sanitize filename (remove special characters)
        $filename = Str::slug($filename);
        
        // Add a unique identifier
        $uniqueId = Str::random(8);
        
        return $filename . '-' . $uniqueId . '.' . $extension;
    }

    /**
     * Get a simplified file type for the frontend.
     */
    private function getFileType($mimeType)
    {
        if (Str::startsWith($mimeType, 'image/')) {
            return 'image';
        }
        
        if ($mimeType === 'application/pdf') {
            return 'pdf';
        }
        
        if (Str::startsWith($mimeType, 'text/') || $mimeType === 'application/msword' || 
            $mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return 'document';
        }
        
        return 'other';
    }
}