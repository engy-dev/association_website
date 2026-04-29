<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'id';

    protected $fillable = [
            'id', 'name', 'email', 'subject', 'message',
            'ip_address', 'user_agent', 'locale',
            'status', 'auto_reply_sent', 'auto_reply_sent_at',
    ];
}