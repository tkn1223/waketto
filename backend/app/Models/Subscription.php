<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Subscription extends Model
{
    protected $fillable = [
        'couple_id',
        'recorded_by_user_id',
        'service_name',
        'amount',
        'billing_interval',
        'start_date',
        'finish_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'finish_date' => 'date',
    ];
}

