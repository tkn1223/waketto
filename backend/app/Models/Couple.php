<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Couple extends Model
{
    protected $fillable = [
        'name',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'couple_id', 'id');
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, 'couple_id', 'id');
    }

    public function budgets()
    {
        return $this->hasMany(Budget::class, 'couple_id', 'id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'couple_id', 'id');
    }

    public function categories()
    {
        return $this->hasMany(Category::class, 'couple_id', 'id');
    }
}
