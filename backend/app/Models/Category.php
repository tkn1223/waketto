<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name',
        'group_id',
        'code',
        'type',
        'recorded_by_user_id',
        'couple_id',
    ];

    public function categoryGroup()
    {
        return $this->belongsTo(CategoryGroup::class, 'group_id', 'id');
    }

    public function payment()
    {
        return $this->hasMany(Payment::class, 'category_id', 'id');
    }

    public function budget()
    {
        return $this->hasMany(Budget::class, 'category_id', 'id');
    }

    public function couple()
    {
        return $this->belongsTo(Couple::class, 'couple_id', 'id');
    }
}
