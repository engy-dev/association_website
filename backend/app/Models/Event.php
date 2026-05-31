<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// ─── Event ───────────────────────────────────────────────────────────────────

class Event extends Model
{
    use HasFactory;

    protected $table = 'EVENTS';
    protected $fillable = [
        'organizer_id',
        'title_en',       'title_fr',       'title_ar',
        'description_en', 'description_fr', 'description_ar',
        'category_en',    'category_fr',    'category_ar',
        'start_datetime', 'end_datetime',
        'location', 'cost', 'capacity', 'is_full', 'is_recurring',
    ];

    protected $casts = [
        'start_datetime' => 'datetime',
        'end_datetime'   => 'datetime',
        'cost'           => 'decimal:2',
        'is_recurring'   => 'boolean',
        'is_full'        => 'boolean',
    ];

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    // Virtual: spots remaining
    public function getSpotsLeftAttribute(): ?int
    {
        return 10;
    }
}