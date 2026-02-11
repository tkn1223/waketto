<?php

namespace Tests\Common;

use App\Models\User;
use App\Http\Middleware\CognitoJwtAuth;

trait MocksCognitoAuth
{
    /**
     * CognitoJwtAuthミドルウェアをモックして認証をバイパス
     * @param User $user
     * @return void
     */
    protected function mockCognitoAuth(User $user): void
    {
        $this->mock(CognitoJwtAuth::class, function ($mock) use ($user) {
            $mock->shouldReceive('handle')
              ->andReturnUsing(function ($request, $next) use ($user) {
                $request->attributes->set('auth_user', $user);
                return $next($request);
              });
        });
    }
}