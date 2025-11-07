<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

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

    public static function newPaymentRecord($data, $user_id, $couple_id)
    {
        try {
            // 最初は自分に設定しておいて、パートナーの場合はパートナーに設定
            $paid_by_user_id = $user_id;

            if ($couple_id) {
                if ($data['payer'] === (string) $couple_id) {
                    $paid_by_user_id = User::getPartnerId($user_id);
                }
            }

            self::create([
                'category_id' => $data['category'],
                'paid_by_user_id' => $paid_by_user_id,
                'recorded_by_user_id' => $user_id,
                'couple_id' => $couple_id,
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

    public static function updatePaymentRecord($validator, $id, $user_id)
    {
        try {
            $paymentData = Payment::find($id);
            if (! $paymentData) {
                return response()->json([
                    'status' => false,
                    'message' => 'Transaction not found',
                ], 500);
            }

            $current_payer = (string) $paymentData->paid_by_user_id;
            $update_payer = $validator->validated()['payer'];

            if ($current_payer === $update_payer) {
                // 支払者が変更なし
                $paid_by_user_id = $current_payer;
            } elseif ($update_payer === (string) $user_id) {
                // 支払者が自分に変更
                $paid_by_user_id = $user_id;
            } else {
                // 支払者がパートナーに変更
                $paid_by_user_id = User::getPartnerId($user_id);
            }

            $paymentData->update([
                'category_id' => $validator->validated()['category'],
                'paid_by_user_id' => $paid_by_user_id,
                'payment_date' => $validator->validated()['date'],
                'amount' => $validator->validated()['amount'],
                'store_name' => $validator->validated()['shop_name'],
                'note' => $validator->validated()['memo'],
            ]);

            return true;

        } catch (\Exception $e) {
            Log::error('Payment update failed', [
                'error' => $e->getMessage(),
                'request_data' => $validator->validated(),
            ]);

            return false;
        }
    }
}
