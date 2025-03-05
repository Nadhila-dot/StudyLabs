<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('create:user', function () {
    $email = $this->ask('What is the user email?');
    $name = $this->ask('What is the user name?');
    $password = $this->secret('What is the user password?');

    $user = User::create([
        'email' => $email,
        'name' => $name,
        'password' => Hash::make($password),
        'level' => 1,
        'prizes' => [],
        'rank' => [],
        'is_admin' => false,
        'last_seen' => now(),
        'streak' => [],
        'description' => '',
        'is_team' => false,
        'banner' => null,
        'ban' => false,
        'avatar' => null
    ]);

    $this->info("User {$user->name} created successfully!");
})->purpose('Create a new user');
