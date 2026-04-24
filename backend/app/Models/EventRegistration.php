<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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