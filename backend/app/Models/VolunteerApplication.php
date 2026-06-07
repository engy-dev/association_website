<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VolunteerApplication extends Model
{
    protected $table      = 'volunteer_applications';
    public    $timestamps = false;

    protected $fillable = [
        'job_id', 'applicant_name', 'applicant_email', 'answers',
    ];

    protected $casts = [
        'answers'      => 'array',
        'submitted_at' => 'datetime',
    ];
}