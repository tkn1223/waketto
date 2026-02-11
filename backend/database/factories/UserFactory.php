<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * User モデル用のファクトリ。テストやシードでユーザーを生成する際に使用する。
 *
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * メール未確認状態で作成したい場合に使う state。
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * モデルのデフォルト状態を定義する。
     * ここで返したカラムが、factory()->create() 時に自動で入力される。
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'cognito_sub' => 'test-cognito-sub-'.$this->faker->unique()->randomNumber(6),
            'name' => $this->faker->name(),
            'user_id' => 'test_u_'.$this->faker->unique()->randomNumber(2),
        ];
    }
}
