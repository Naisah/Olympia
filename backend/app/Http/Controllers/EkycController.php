<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\User;

class EkycController extends Controller
{
    public function verify(Request $request, bool $includeEncoding = false)
    {
        $request->validate([
            'id_image' => 'required|image|mimes:jpeg,png,jpg|max:5120',
            'selfie_image' => 'required|image|mimes:jpeg,png,jpg|max:5120',
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
        ]);

        // Forward images to the Python Microservice internally
        try {
        $key = config('services.face_verification.key');
        if (!$key) {
            return response()->json(['error' => 'Identity verification is not configured.'], 503);
        }
        $response = Http::withHeaders(['X-Service-Key' => $key])->timeout(60)->connectTimeout(5)->attach(
            'id_image', file_get_contents($request->file('id_image')->getRealPath()), 'id_image.jpg'
        )->attach(
            'selfie_image', file_get_contents($request->file('selfie_image')->getRealPath()), 'selfie_image.jpg'
        )->post(rtrim(config('services.face_verification.url'), '/') . '/api/register_ekyc', [
            'first_name' => $request->first_name,
            'last_name' => $request->last_name
        ]);

        } catch (\Illuminate\Http\Client\ConnectionException $error) {
            return response()->json(['error' => 'Identity verification is temporarily unavailable. Please try again.'], 503);
        }

        if (!$response->successful()) {
            // Python returned an error (like 400 Bad Request for Security mismatch)
            $errorData = $response->json();
            $message = $errorData['error'] ?? $errorData['detail'] ?? null;
            if (is_string($message) && in_array($response->status(), [400, 413, 422])) {
                return response()->json(['error' => $message], $response->status());
            }
            return response()->json(['error' => 'Face verification is temporarily unavailable.'], 503);
        }

        $data = $response->json();

        // If Python rejected it (Face mismatch or OCR mismatch)
        if (!isset($data['match']) || $data['match'] !== true) {
            return response()->json($data, 400); // Pass Python's specific error message to React
        }

        // Sybil Attack / Duplication Check (1:N matching in PHP)
        $newEncodingStr = $data['face_encoding'] ?? '';
        $encoding = is_string($newEncodingStr) ? json_decode($newEncodingStr, true) : null;
        if (!$this->validEncoding($encoding)) {
            return response()->json(['error' => 'Invalid identity verification response.'], 502);
        }
        if ($this->isDuplicateFace($newEncodingStr)) {
            return response()->json([
                'match' => false,
                'error' => 'SECURITY ALERT: This face is already registered to another account. Duplicate registrations are prohibited.'
            ], 403);
        }

        // If everything passes, return success back to React!
        return response()->json($includeEncoding ? $data : [
            'match' => true, 'message' => 'Face match successful. ID details require staff review.',
        ]);
    }

    public function isDuplicateFace($newEncodingStr, $threshold = 0.55)
    {
        // 0.55 is a strict threshold for face_recognition (default is 0.6)
        $users = User::whereNotNull('face_encoding')->select(['id', 'face_encoding'])->lazyById(100);
        $newEncArr = json_decode($newEncodingStr, true);
        
        if (!is_array($newEncArr) || count($newEncArr) !== 128) {
            return false;
        }

        foreach ($users as $user) {
            $dbEncArr = json_decode($user->face_encoding, true);
            if (!$this->validEncoding($dbEncArr)) continue;
            
            $distance = 0;
            for ($i = 0; $i < 128; $i++) {
                $distance += pow($newEncArr[$i] - $dbEncArr[$i], 2);
            }
            $distance = sqrt($distance);
            
            if ($distance < $threshold) {
                return true; // Match found (duplicate identity!)
            }
        }
        return false;
    }

    private function validEncoding($encoding): bool
    {
        return is_array($encoding) && array_is_list($encoding) && count($encoding) === 128
            && count(array_filter($encoding, fn ($value) => (is_int($value) || is_float($value)) && is_finite((float) $value))) === 128;
    }
}
