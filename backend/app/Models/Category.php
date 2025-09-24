<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name',
        'code',
        'group_code',
        'type',
        'recorded_by_user_id',
        'couple_id',
    ];

    public function categoryGroup()
    {
        return $this->belongsTo(CategoryGroup::class, 'group_code', 'code');
    }

    public function payment()
    {
        return $this->hasMany(Payment::class, 'category_id', 'id');
    }
}
