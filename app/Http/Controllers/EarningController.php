<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class EarningController extends Controller
{
    // Display the earning page
    public function earn(Request $request)
    {
        // Log all request details
        Log::info('HTTP Request Details:', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'headers' => $request->headers->all(),
            'query' => $request->query(),
            'body' => $request->all(),
        ]);

        $redeemCode = $request->query('code');
        $referer = $request->headers->get('referer');

        if ($redeemCode) {
            $user = Auth::user();

            if (!$user || $user->redeem_code !== $redeemCode) {
                return back()->with('Error', 'Invalid code.');
            }

            // Check if the referer is from linkvertise.com
            if ($referer && str_contains($referer, 'linkvertise.com')) {
                // Clear the redeem code to prevent reuse
                $user->redeem_code = null;

                // Add coins to the user's coins array
                $coinReward = env('LINKVERTISE_COIN_REWARD', 100);
                $coins = $user->coins ?? ['amount' => 0, 'last_earned' => null];
                
                // Update the amount and last_earned timestamp
                $coins['amount'] = ($coins['amount'] ?? 0) + $coinReward;
                $coins['last_earned'] = Carbon::now()->toIso8601String();
                
                $user->coins = $coins;
                $user->save();

                return Inertia::render('User/Earn', [
                    'linkvertiseEnabled' => env('LINKVERTISE_ENABLED', false),
                    'linkvertiseId' => env('LINKVERTISE_ID', 'default_id'),
                    'status' => 'Success',
                ]);
            } else {
                return back()->with('Error', 'Referral not verified. No coins awarded.');
            }
        }

        // Log the Linkvertise configuration values directly from .env
        Log::info('Linkvertise Configuration:', [
            'enabled' => env('LINKVERTISE_ENABLED', false),
            'id' => env('LINKVERTISE_ID', '1229986'),
        ]);

        // Normal rendering without awarding coins
        return Inertia::render('User/Earn', [
            'linkvertiseEnabled' => env('LINKVERTISE_ENABLED', false),
            'linkvertiseId' => env('LINKVERTISE_ID', '1229986'),
        ]);
    }


public function generateLinkvertiseLink(Request $request)
{
    $user = Auth::user();

    // Generate a unique redeem code
    $redeemCode = Str::random(16);

    // Store the redeem code in the user's model
    $user->redeem_code = $redeemCode;
    $user->save();

    // Generate the domain link
    $domainLink = url('/earn?code=' . urlencode($redeemCode));

    // Generate the Linkvertise URL
    $linkvertiseUrl = $this->generateLinkvertiseUrl($domainLink);

    // Send the link as an Inertia flash message
    return back()->with('linkvertiseUrl', $linkvertiseUrl);
}
}