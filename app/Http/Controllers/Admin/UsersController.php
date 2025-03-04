<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UsersController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $showBanned = $request->input('banned') === 'true';
        $showAdmins = $request->input('admins') === 'true';
        $showTeams = $request->input('teams') === 'true';
        
        $query = User::query();
        
        // Apply search if provided
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        // Apply filters
        if ($showBanned) {
            $query->where('ban', true);
        }
        
        if ($showAdmins) {
            $query->where('is_admin', true);
        }
        
        if ($showTeams) {
            $query->where('is_team', true);
        }
        
        // Paginate results
        $users = $query->latest()->paginate(10)->withQueryString();
        
        return Inertia::render('admin/User/Usersview', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'banned' => $showBanned ? 'true' : 'false',
                'admins' => $showAdmins ? 'true' : 'false',
                'teams' => $showTeams ? 'true' : 'false',
            ]
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'level' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'is_admin' => 'boolean',
            'is_team' => 'boolean',
            'ban' => 'boolean',
        ]);
        
        // Make sure we don't lock ourselves out
        if ($user->id === auth()->id() && isset($validated['is_admin']) && !$validated['is_admin']) {
            return redirect()->back()->with('error', 'You cannot remove your own admin privileges.');
        }
        
        // Make sure we don't ban ourselves
        if ($user->id === auth()->id() && isset($validated['ban']) && $validated['ban']) {
            return redirect()->back()->with('error', 'You cannot ban your own account.');
        }
        
        $user->update($validated);
        
        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user)
    {
        // Prevent self-deletion
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }
        
        $user->delete();
        
        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }
}