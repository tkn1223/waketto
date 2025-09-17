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

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'cognito_sub',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        // Cognito認証を使用するため、password関連フィールドは削除済み
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            // Cognito認証を使用するため、password関連フィールドは削除済み
        ];
    }

    /**
     * Cognito SubでユーザーをIDで検索、存在しない場合は作成
     */
    public static function findOrCreateByCognitoSub(string $cognitoSub, array $userData): self
    {
        $user = User::where('cognito_sub', $cognitoSub)->first();

        if (!$user) {
            $user = User::create([
                'cognito_sub' => $cognitoSub,
                'name' => $userData['name'] ?? '',
            ]);
        }

        return $user;
    }
}
