<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class IdentityReviewController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->validate(['status' => 'nullable|in:pending,verified,rejected']);
        return User::with('resident')->whereNotNull('id_image_path')
            ->where('kyc_status', $data['status'] ?? 'pending')
            ->orderBy('id')->paginate(20)->through(fn (User $user) => array_merge($user->toArray(), [
                'has_back_image' => (bool) $user->id_back_image_path,
            ]));
    }

    public function image(User $user, string $side = 'front')
    {
        $path = $side === 'back' ? $user->id_back_image_path : $user->id_image_path;
        abort_unless($this->hasPrivateImage($path), 404, 'ID image is unavailable.');
        return response()->file(Storage::disk('local')->path($path), [
            'Cache-Control' => 'private, no-store',
            'X-Content-Type-Options' => 'nosniff',
        ])->setPrivate();
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'status' => 'required|in:verified,rejected',
            'note' => 'required_if:status,rejected|nullable|string|max:1000',
            'confirmed' => 'required|accepted',
        ]);
        return DB::transaction(function () use ($request, $user, $data) {
            $user = User::whereKey($user->id)->lockForUpdate()->firstOrFail();
            if ($user->kyc_status !== 'pending') {
                throw ValidationException::withMessages(['status' => 'This account has already been reviewed. Refresh the list.']);
            }
            if (!$this->hasPrivateImage($user->id_image_path) || ($user->id_back_image_path && !$this->hasPrivateImage($user->id_back_image_path))) {
                throw ValidationException::withMessages(['status' => 'The ID image is unavailable. Restore it before reviewing this account.']);
            }
            $user->forceFill([
                'kyc_status' => $data['status'],
                'kyc_verified_at' => $data['status'] === 'verified' ? now() : null,
                'kyc_reviewed_at' => now(),
                'kyc_reviewed_by' => $request->user()->id,
                'kyc_review_note' => $data['note'] ?? null,
            ])->save();
            return response()->json(['message' => 'Identity review saved.', 'user' => $user]);
        });
    }

    private function hasPrivateImage(?string $path): bool
    {
        return is_string($path)
            && preg_match('#^id_images/[a-zA-Z0-9_.-]+$#D', $path)
            && Storage::disk('local')->exists($path);
    }
}
