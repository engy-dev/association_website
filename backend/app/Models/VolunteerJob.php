<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VolunteerJob extends Model
{
    protected $table = 'volunteer_jobs';

    protected $fillable = [
        'title_en', 'title_fr', 'title_ar',
        'description_en', 'description_fr', 'description_ar',
        'location', 'expires_at', 'questions',
    ];

    protected $casts = [
        'questions'  => 'array',
        'expires_at' => 'datetime',
    ];
}