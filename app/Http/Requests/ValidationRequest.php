<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ValidationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function failedValidation(Validator $validator)
    {
        $data = [
            "status" => "error",
            "message" => "Validation Error",
            "errors" => $validator->errors(),
        ];
        throw new HttpResponseException(response()->json($data, 422));
    }
}
