<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MailContent extends Model
{
    protected $table = 'MAIL_CONTENT';
    protected $primaryKey = 'email_id';
    public $timestamps = false;

    protected $fillable = [
        'language',
        'content',
        'title',
        'created_at',
    ];
}