<?php

namespace Tests\Common;

use App\Http\Middleware\CognitoJwtAuth;
use App\Models\User;

trait MocksCognitoAuth
{
    /**
     * CognitoJwtAuthミドルウェアをモックして認証をバイパス
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
