<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class BlogPost extends Model
{
    use HasFactory;

    protected $table = 'BLOG_POSTS';
    protected $primaryKey = 'id';

    protected $fillable = [
        'title_fr',
        'title_en',
        'title_ar',
        'content_fr',
        'content_en',
        'content_ar',
        'author_name',
        'status',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'created_at'   => 'datetime',
    ];
}