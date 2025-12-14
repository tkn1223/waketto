<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

        if (! $user) {
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
    private static function generateUserId(): string
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

    /**
     * パートナー設定
     */
    public static function setPartner(User $user, User $partner): bool
    {
        DB::beginTransaction();

        try {
            Log::warning('[DEBUG] Couple作成開始', [
                'user_user_id' => $user->user_id,
                'partner_user_id' => $partner->user_id,
            ]);

            $couple = Couple::create([
                'name' => $user->user_id.' & '.$partner->user_id,
            ]);

            Log::warning('[DEBUG] Couple作成成功', [
                'couple_id' => $couple->id,
                'couple_name' => $couple->name,
            ]);

            Log::warning('[DEBUG] User更新開始', [
                'user_id' => $user->id,
                'couple_id' => $couple->id,
            ]);

            $user->update([
                'couple_id' => $couple->id,
                'pair_index' => 1,
            ]);

            Log::warning('[DEBUG] User更新成功');

            Log::warning('[DEBUG] Partner更新開始', [
                'partner_id' => $partner->id,
                'couple_id' => $couple->id,
            ]);

            $partner->update([
                'couple_id' => $couple->id,
                'pair_index' => 2,
            ]);

            Log::warning('[DEBUG] Partner更新成功');

            Log::warning('[DEBUG] トランザクションコミット開始');
            DB::commit();
            Log::warning('[DEBUG] トランザクションコミット成功');

            return true;
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('パートナー設定エラー', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
                'partner_id' => $partner->id,
            ]);

            return false;
        }
    }

    /**
     * partnerのidを取得
     */
    public static function getPartnerId($user_id)
    {
        try {
            $couple_id = User::where('id', $user_id)->first()->couple_id;

            $partner_id = User::where('couple_id', $couple_id)
                ->where('id', '!=', $user_id)
                ->first()
                ->id;

            return $partner_id;
        } catch (\Exception $e) {
            Log::error('Partner ID取得エラー', [
                'error' => $e->getMessage(),
                'user_id' => $user_id,
            ]);

            return $user_id;
        }
    }

    /**
     * パートナーのuser_idを取得
     */
    public static function getPartnerUserId($user)
    {
        try {
            $partnerId = self::getPartnerId($user->id);
            $partner = User::where('id', $partnerId)->first();

            if (! $partner) {
                return null;
            }

            return $partner->user_id;
        } catch (\Exception $e) {
            Log::error('Partner User ID取得エラー', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
            ]);

            return null;
        }
    }
}
