<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Resident;

class UserAuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => ['required', 'string', 'confirmed', 'max:72', \Illuminate\Validation\Rules\Password::min(8)->mixedCase()->numbers()],
            'address' => 'required|string|max:255',
            'contact_number' => ['required', 'string', 'regex:/^(09|\\+639)\\d{9}$/'],
            'id_image' => 'required|image|mimes:jpeg,png,jpg|max:5120',
            'back_id_image' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'id_type' => 'nullable|string|max:50',
            'selfie_image' => 'required|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        // Recheck the images on the server; never trust a client-supplied encoding.
        $verification = app(EkycController::class)->verify($request, true);
        if ($verification->getStatusCode() !== 200) {
            return $verification;
        }
        $encoding = $verification->getData(true)['face_encoding'];
        $path = $request->file('id_image')->store('id_images', 'local');
        abort_if($path === false, 500, 'Unable to save ID image.');

        $backPath = null;
        try {
            if ($request->hasFile('back_id_image')) {
                $backPath = $request->file('back_id_image')->store('id_images', 'local');
                abort_if($backPath === false, 500, 'Unable to save back ID image.');
            }
            [$user, $token] = \Illuminate\Support\Facades\DB::transaction(function () use ($data, $encoding, $path, $backPath) {
                // Serialize only the final identity check and insert across all application workers.
                \Illuminate\Support\Facades\DB::table('registration_locks')->where('id', 1)->lockForUpdate()->firstOrFail();
                if (app(EkycController::class)->isDuplicateFace($encoding)) {
                    throw \Illuminate\Validation\ValidationException::withMessages(['id_image' => 'This face is already registered.']);
                }
                if (User::where('email', $data['email'])->exists()) {
                    throw \Illuminate\Validation\ValidationException::withMessages(['email' => 'This email is already registered.']);
                }
                $user = User::create([
                    'name' => $data['first_name'] . ' ' . $data['last_name'],
                    'email' => $data['email'],
                    'password' => Hash::make($data['password']),
                    'face_encoding' => $encoding,
                    'id_image_path' => $path,
                    'id_back_image_path' => $backPath,
                    'id_type' => $data['id_type'] ?? null,
                    'kyc_status' => 'pending',
                ]);
                $user->resident()->create(collect($data)->only([
                    'first_name', 'last_name', 'email', 'address', 'contact_number',
                ])->all());
                return [$user, $user->createToken('user-token')->plainTextToken];
            });
        } catch (\Throwable $error) {
            \Illuminate\Support\Facades\Storage::disk('local')->delete($path);
            if ($backPath) \Illuminate\Support\Facades\Storage::disk('local')->delete($backPath);
            throw $error;
        }

        return response()->json(['user' => $user->load('resident'), 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|max:72'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid login credentials'
            ], 401);
        }

        $user->tokens()->delete();
        $token = $user->createToken('user-token')->plainTextToken;

        return response()->json([
            'user' => $user->load('resident'),
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('resident')
        ]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'email' => 'required|email:rfc|max:255|unique:users,email,' . $request->user()->id,
            'address' => 'required|string|max:255',
            'contact_number' => ['required', 'regex:/^(09|\+639)\d{9}$/'], // Validates PH Mobile Numbers
        ]);

        $user = $request->user();
        \Illuminate\Support\Facades\DB::transaction(function () use ($user, $request) {
        $user->update([
            'name' => $request->first_name . ' ' . $request->last_name,
            'email' => $request->email,
        ]);

        $resident = $user->resident;
        if ($resident) {
            if ($resident->first_name !== $request->first_name || $resident->last_name !== $request->last_name) {
                $user->forceFill([
                    'kyc_status' => 'pending', 'kyc_verified_at' => null,
                    'kyc_reviewed_at' => null, 'kyc_reviewed_by' => null, 'kyc_review_note' => null,
                ])->save();
            }
            $resident->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'address' => $request->address,
                'contact_number' => $request->contact_number,
            ]);
        }

        });

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->load('resident')
        ]);
    }
}
