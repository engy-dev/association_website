<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    use HasFactory;

    protected $table = 'NEWSLETTER_SUBSCRIBERS';
    protected $primaryKey = 'subscriber_id';
    public $timestamps = false;

    protected $fillable = [
        'newsletters',
        'email',
        'subscribed_at',
        'unsubscribed_at',
    ];
}
