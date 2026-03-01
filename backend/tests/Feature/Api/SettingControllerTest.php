<?php

namespace Tests\Feature\Api;

use App\Models\Couple;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Common\MocksCognitoAuth;
use Tests\TestCase;

class SettingControllerTest extends TestCase
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
     * 正常系 - entry：ユーザー名のみ更新できることを確認
     */
    public function test_entry_updates_user_name_only(): void
    {
        $newName = '新しい名前';

        $response = $this->postJson('/api/partner-setting', [
            'name' => $newName,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'ユーザー情報を保存しました',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => $newName,
        ]);
    }

    /**
     * 正常系 - entry：パートナーIDのみ設定できることを確認（Couple作成・双方のcouple_id更新）
     */
    public function test_entry_sets_partner_only_and_creates_couple(): void
    {
        $response = $this->postJson('/api/partner-setting', [
            'partner_id' => $this->partner->user_id,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'ユーザー情報を保存しました',
            ]);

        $this->assertDatabaseCount('couples', 1);

        $couple = Couple::first();
        $this->assertNotNull($couple);
        $this->assertStringContainsString($this->user->user_id, $couple->name);
        $this->assertStringContainsString($this->partner->user_id, $couple->name);

        $this->user->refresh();
        $this->partner->refresh();
        $this->assertSame($couple->id, $this->user->couple_id);
        $this->assertSame($couple->id, $this->partner->couple_id);
    }

    /**
     * 正常系 - entry：ユーザー名とパートナーIDを同時に設定できることを確認
     */
    public function test_entry_updates_name_and_sets_partner_together(): void
    {
        $newName = '設定後ユーザー名';

        $response = $this->postJson('/api/partner-setting', [
            'name' => $newName,
            'partner_id' => $this->partner->user_id,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'ユーザー情報を保存しました',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => $newName,
        ]);

        $this->assertDatabaseCount('couples', 1);
        $couple = Couple::first();
        $this->user->refresh();
        $this->partner->refresh();
        $this->assertSame($couple->id, $this->user->couple_id);
        $this->assertSame($couple->id, $this->partner->couple_id);
    }
}
