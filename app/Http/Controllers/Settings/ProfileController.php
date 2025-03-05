<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        
        $request->user()->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'description' => $validated['description'] ?? $request->user()->description,
        ]);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Update the user's avatar.
     */
    public function updateAvatar(Request $request)
    {
        $validated = $request->validate([
            'avatar' => ['required', 'image', 'max:2048'], // 2MB max
        ]);
        
        $user = $request->user();
        $file = $request->file('avatar');
        
        // Convert the image to base64
        $imageData = file_get_contents($file->getPathname());
        $base64Image = 'data:' . $file->getClientMimeType() . ';base64,' . base64_encode($imageData);
        
        // Store the base64 string directly in the user model
        $user->avatar = $base64Image;
        $user->save();
        
        return Redirect::route('profile.edit');

    }
    
    /**
     * Update the user's banner.
     */
    public function updateBanner(Request $request)
    {
        $validated = $request->validate([
            'banner' => ['required', 'image', 'max:5120'], // 5MB max
        ]);
        
        $user = $request->user();
        $file = $request->file('banner');
        
        // Convert the image to base64
        $imageData = file_get_contents($file->getPathname());
        $base64Image = 'data:' . $file->getClientMimeType() . ';base64,' . base64_encode($imageData);
        
        // Store the base64 string directly in the user model
        $user->banner = $base64Image;
        $user->save();
        
        return Redirect::route('profile.edit');
    }
    
    /**
     * Update the user's description.
     */
    public function updateDescription(Request $request)
    {
        $validated = $request->validate([
            'description' => ['required', 'string', 'max:1000'],
        ]);
        
        $user = $request->user();
        $user->description = $validated['description'];
        $user->save();

        return Redirect::route('profile.edit');
        
        
        
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        // Existing destroy method implementation
    }
}