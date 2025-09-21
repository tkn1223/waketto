<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'category_id',
        'paid_by_user_id',
        'recorded_by_user_id',
        'couple_id',
        'payment_date',
        'amount',
        'store_name',
        'note',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'code');
    }
}
