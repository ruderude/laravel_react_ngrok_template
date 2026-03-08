<?php

namespace App\Http\Controllers\Auth;

use app\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function __invoke(LoginRequest $request): JsonResponse
    {
        // TODO

        return response()->json();
    }
}
