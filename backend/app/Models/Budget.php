<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Category;

class Budget extends Model
{
    protected $fillable = [
        'couple_id',
        'recorded_by_user_id',
        'category_id',
        'amount',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }
}
