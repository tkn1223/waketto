<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use App\Models\User;

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

  public static function newPaymentRecord($data, $user_id)
  {
    try {
      $payer = User::where('user_id', $data['payer'])
               ->first()
               ->id;

      self::create([
        'category_id' => $data['category'],
        'paid_by_user_id' => $payer,
        'recorded_by_user_id' => $user_id,
        'payment_date' => $data['date'],
        'amount' => $data['amount'],
        'store_name' => $data['shop_name'],
        'note' => $data['memo'],
      ]);

      return true;

    } catch (\Exception $e) {
      Log::error('Payment creation failed', [
        'error' => $e->getMessage(),
        'data' => $data,
        'user_id' => $user_id,
      ]);
      return false;
    }
  }
}
