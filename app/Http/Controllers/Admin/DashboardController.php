<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'users_count' => User::count(),
            'admins_count' => User::where('is_admin', true)->count(),
            'new_users_today' => User::whereDate('created_at', today())->count(),
        ];
        
        return Inertia::render('admin/Index/Adminview', [
            'stats' => $stats
        ]);
    }

    
    
    public function settings(): Response
    {
        return Inertia::render('admin/Settings');
    }
    
    public function analytics(): Response
    {
        // Get some sample analytics data
        $userGrowthData = User::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->limit(30)
            ->get();
            
        return Inertia::render('admin/Analytics', [
            'userGrowthData' => $userGrowthData
        ]);
    }
}