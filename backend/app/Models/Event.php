<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// ─── Event ───────────────────────────────────────────────────────────────────

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'description', 'excerpt',
        'category', 'location', 'start_date', 'end_date',
        'price', 'capacity', 'image_url',
        'is_recurring', 'recurrence_rule',
        'is_published',
    ];

    protected $casts = [
        'start_date'   => 'datetime',
        'end_date'     => 'datetime',
        'price'        => 'decimal:2',
        'is_recurring' => 'boolean',
        'is_published' => 'boolean',
    ];

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    // Virtual: spots remaining
    public function getSpotsLeftAttribute(): ?int
    {
        if (!$this->capacity) return null;
        $taken = $this->registrations()->sum('quantity');
        return max(0, $this->capacity - $taken);
    }
}