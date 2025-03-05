<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'level',
        'prizes',
        'rank',
        'is_admin',
        'last_seen',
        'streak',
        'description',
        'is_team',
        'banner',
        'ban',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
{
    return [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'level' => 'integer',
        'prizes' => 'array',
        'rank' => 'array',
        'is_admin' => 'boolean',
        'last_seen' => 'datetime',
        'streak' => 'array',
        'description' => 'string',
        'is_team' => 'boolean',
        'ban' => 'boolean',
    ];
}
}