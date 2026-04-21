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

// ─── EventRegistration ───────────────────────────────────────────────────────

class EventRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'event_id', 'quantity',
        'status',               // 'confirmed' | 'cancelled' | 'pending'
        'subscribe_recurring',
        'amount_paid',
        'stripe_payment_id',
    ];

    protected $casts = [
        'subscribe_recurring' => 'boolean',
        'amount_paid'         => 'decimal:2',
    ];

    public function user()  { return $this->belongsTo(User::class); }
    public function event() { return $this->belongsTo(Event::class); }
}

// ─── BlogPost ─────────────────────────────────────────────────────────────────

class BlogPost extends Model
{
    use HasFactory;

    protected $table = 'BLOG_POSTS';
    protected $primaryKey = 'id';

    protected $fillable = [
        'title',
        'content',
        'author_name',
        'status',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'created_at'   => 'datetime',
    ];
}

// ─── Production ───────────────────────────────────────────────────────────────

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

// ─── Donation ─────────────────────────────────────────────────────────────────

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'amount', 'frequency',
        'donor_name', 'donor_email', 'anonymous',
        'stripe_payment_id', 'receipt_url',
    ];

    protected $casts = [
        'amount'    => 'decimal:2',
        'anonymous' => 'boolean',
    ];

    public function user() { return $this->belongsTo(User::class); }
}

// ─── ContactMessage ───────────────────────────────────────────────────────────

class ContactMessage extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'email', 'subject', 'message'];
}

// ─── NewsletterSubscriber ─────────────────────────────────────────────────────

class NewsletterSubscriber extends Model
{
    use HasFactory;

    protected $fillable = ['email'];
}

// ─── VolunteerApplication ─────────────────────────────────────────────────────

class VolunteerApplication extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'email', 'phone', 'availability', 'motivation'];
}
