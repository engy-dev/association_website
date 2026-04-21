<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',                   // 'member' | 'volunteer' | 'admin'
        'newsletter',
        'membership_status',      // 'active' | 'expired' | 'none'
        'membership_expires_at',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at'    => 'datetime',
        'membership_expires_at'=> 'datetime',
        'newsletter'           => 'boolean',
        'password'             => 'hashed',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function eventRegistrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }

    public function blogPosts()
    {
        return $this->hasMany(BlogPost::class, 'author_id');
    }
}
