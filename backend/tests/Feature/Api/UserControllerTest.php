<?php

namespace Tests\Feature\Api;

use App\Models\Couple;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Common\MocksCognitoAuth;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use MocksCognitoAuth;
    use RefreshDatabase;

    protected User $user;

    protected User $partner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->partner = User::factory()->create();

        $this->mockCognitoAuth($this->user);
    }

    /**
     * user と partner を Couple で紐づけ、その Couple を返す
     */
    private function createCoupleForUserAndPartner(): Couple
    {
        $couple = Couple::create([
            'name' => $this->user->user_id.' & '.$this->partner->user_id,
        ]);
        $this->user->update(['couple_id' => $couple->id]);
        $this->partner->update(['couple_id' => $couple->id]);

        return $couple;
    }

    /**
     * 正常系 - getUserInfo：単独ユーザーの場合、partner_user_id / partner_id が null で返る
     */
    public function test_getUserInfo_returns_null_partner_ids_when_single_user(): void
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJson([
                'id' => $this->user->id,
                'user_id' => $this->user->user_id,
                'name' => $this->user->name,
                'couple_id' => null,
                'partner_user_id' => null,
                'partner_id' => null,
            ]);
    }

    /**
     * 正常系 - getUserInfo：パートナー設定済みの場合、partner_user_id / partner_id が相手の値で返る
     */
    public function test_getUserInfo_returns_partner_ids_when_couple_set(): void
    {
        $this->createCoupleForUserAndPartner();

        $response = $this->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJson([
                'id' => $this->user->id,
                'user_id' => $this->user->user_id,
                'name' => $this->user->name,
                'couple_id' => $this->user->couple_id,
                'partner_user_id' => $this->partner->user_id,
                'partner_id' => $this->partner->id,
            ]);
    }

    /**
     * 正常系 - profile：認証ユーザーの id, name, cognito_sub が data に含まれて返る
     */
    public function test_profile_returns_user_data(): void
    {
        $response = $this->getJson('/api/profile');

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'cognito_sub' => $this->user->cognito_sub,
                ],
            ]);
    }

    /**
     * 正常系 - updateProfile：name を送信すると名前が更新され、メッセージと data が返る
     */
    public function test_updateProfile_updates_name_and_returns_message_and_data(): void
    {
        $newName = '更新後の名前';

        $response = $this->putJson('/api/profile', [
            'name' => $newName,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'プロファイルが更新されました',
                'data' => [
                    'id' => $this->user->id,
                    'name' => $newName,
                    'cognito_sub' => $this->user->cognito_sub,
                ],
            ])
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'cognito_sub',
                    'updated_at',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => $newName,
        ]);
    }
}
