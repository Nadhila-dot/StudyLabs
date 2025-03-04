<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Resource extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'preview_url',
        'subject',
        'term',
        'category',
        'etc', // Additional data as JSON
        'user_id'
    ];
    
    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'etc' => 'array',
    ];
    
    /**
     * Get the user who created the resource.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}