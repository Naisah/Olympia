<?php

namespace App\Http\Middleware;

use App\Models\Admin;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class RequireAccountType
{
    public function handle(Request $request, Closure $next, string $type)
    {
        $model = $type === 'admin' ? Admin::class : User::class;
        abort_unless($request->user() instanceof $model, 403);

        return $next($request);
    }
}
