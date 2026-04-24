<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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