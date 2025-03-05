<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'description' => 'nullable|string|max:50000',
        ]);

        // Process avatar into base64 if present
        $avatarBase64 = null;
        if ($request->hasFile('avatar')) {
            $avatarContents = file_get_contents($request->file('avatar')->getRealPath());
            $avatarBase64 = 'data:' . $request->file('avatar')->getMimeType() . ';base64,' . base64_encode($avatarContents);
        }

        // Process banner into base64 if present
        $bannerBase64 = null;
        if ($request->hasFile('banner')) {
            $bannerContents = file_get_contents($request->file('banner')->getRealPath());
            $bannerBase64 = 'data:' . $request->file('banner')->getMimeType() . ';base64,' . base64_encode($bannerContents);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'level' => 0,
            'prizes' => [],
            'rank' => ['Niponvanjith'],
            'is_admin' => false,
            'last_seen' => now(),
            'streak' => [],
            'description' => $request->description ?? '',
            'is_team' => false,
            'banner' => $bannerBase64,
            'ban' => false,
            'avatar' => $avatarBase64,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }
}