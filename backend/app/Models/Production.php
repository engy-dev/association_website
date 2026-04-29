<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Production extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'description',
        'year', 'image_url', 'video_url',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];
}