<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'user_id',
        'cognito_sub',
        'couple_id',
        'pair_index',

    ];

    /**
     * Cognito SubでユーザーをIDで検索、存在しない場合は作成
     */
    public static function findOrCreateByCognitoSub(string $cognitoSub): User
    {
        $user = User::where('cognito_sub', $cognitoSub)->first();

        if (!$user) {
            $userId = self::generateUserId();
            $user = User::create([
                'cognito_sub' => $cognitoSub,
                'name' => $userId,
                'user_id' => $userId,
            ]);
        }

        return $user;
    }

    /**
     * ユーザーIDを生成
     */
    private function generateUserId(): string
    {
        $chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        $length = 10;

        do {
            $userId = '';
            for ($i = 0; $i < $length; $i++) {
                $userId .= $chars[random_int(0, strlen($chars) - 1)];
            }
        } while (User::where('user_id', $userId)->exists());

        return $userId;
    }
}
