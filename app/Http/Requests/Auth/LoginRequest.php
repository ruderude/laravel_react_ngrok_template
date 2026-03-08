<?php namespace app\Http\Requests\Auth;

use App\Http\Requests\ValidationRequest;

class LoginRequest extends ValidationRequest
{
    public function rules(): array
    {
        return [
            "email" => ["required", "string", "email", "max:255"],
            "password" => ["required", "string", "min:8", "max:255"],
        ];
    }

    public function getEmail(): string
    {
        return $this->input("email");
    }

    public function getPassword(): string
    {
        return $this->input("password");
    }
}
