<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryGroup extends Model
{
    protected $fillable = [
        'name',
        'code',
    ];

    public function category()
    {
        return $this->hasMany(Category::class, 'group_code', 'code');
    }
}
