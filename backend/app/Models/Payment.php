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
    return $this->belongsTo(Category::class, 'category_id', 'id');
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

  public static function updatePaymentRecord($validator, $id)
  {
    try {
      $paymentData = Payment::find($id);
      if (!$paymentData) {
          return response()->json([
              'status' => false,
              'message' => 'Transaction not found'
          ], 500);
      }

      $paymentData->update([
        'category_id' => $validator->validated()['category'],
        'paid_by_user_id' => $validator->validated()['payer'],
        'payment_date' => $validator->validated()['date'],
        'amount' => $validator->validated()['amount'],
        'store_name' => $validator->validated()['shop_name'],
        'note' => $validator->validated()['memo'],
      ]);

      return true;

    } catch (\Exception $e) {
      Log::error('Payment update failed', [
        'error' => $e->getMessage(),
        'request_data' => $validator->validated()
      ]);
      return false;
    }
  }
}
