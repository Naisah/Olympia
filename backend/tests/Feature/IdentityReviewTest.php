<?php

namespace Tests\Feature;

use App\Models\{Admin, User};
use App\Mail\ContactMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\{Http, Mail, Storage};
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class IdentityReviewTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        Storage::fake('public');
        Http::preventStrayRequests();
        config(['services.face_verification.key' => 'test-service-key']);
    }

    private function admin(): Admin
    {
        return Admin::create(['name' => 'Reviewer', 'email' => 'reviewer@example.com', 'password' => 'Password12345']);
    }

    private function account(): User
    {
        $user = User::factory()->create(['id_image_path' => 'id_images/front.jpg', 'id_back_image_path' => 'id_images/back.jpg', 'kyc_status' => 'pending']);
        Storage::disk('local')->put('id_images/front.jpg', UploadedFile::fake()->image('front.jpg')->get());
        Storage::disk('local')->put('id_images/back.jpg', UploadedFile::fake()->image('back.jpg')->get());
        return $user;
    }

    public function test_identity_images_and_reviews_require_admin_authorization(): void
    {
        $user = $this->account();
        $this->getJson('/api/admin/identity-reviews')->assertUnauthorized();
        $this->getJson('/api/admin/identity-reviews/'.$user->id.'/image')->assertUnauthorized();
        Sanctum::actingAs($user);
        $this->getJson('/api/admin/identity-reviews')->assertForbidden();
        $this->getJson('/api/admin/identity-reviews/'.$user->id.'/image/back')->assertForbidden();
        $this->putJson('/api/admin/identity-reviews/'.$user->id, ['status' => 'verified', 'confirmed' => true])->assertForbidden();
    }

    public function test_admin_can_review_private_images_and_decisions_are_audited(): void
    {
        $user = $this->account();
        $admin = $this->admin();
        Sanctum::actingAs($admin);
        $this->getJson('/api/admin/identity-reviews')->assertOk()->assertJsonPath('data.0.has_back_image', true)->assertJsonMissingPath('data.0.id_image_path')->assertJsonMissingPath('data.0.id_back_image_path');
        $this->get('/api/admin/identity-reviews/'.$user->id.'/image')->assertOk()->assertHeader('Cache-Control', 'no-store, private');
        $this->get('/api/admin/identity-reviews/'.$user->id.'/image/back')->assertOk();
        $this->putJson('/api/admin/identity-reviews/'.$user->id, ['status' => 'verified'])->assertUnprocessable();
        $this->putJson('/api/admin/identity-reviews/'.$user->id, ['status' => 'rejected', 'confirmed' => true])->assertUnprocessable();
        $this->putJson('/api/admin/identity-reviews/'.$user->id, ['status' => 'verified', 'confirmed' => true])->assertOk();
        $user->refresh();
        $this->assertSame('verified', $user->kyc_status);
        $this->assertSame($admin->id, $user->kyc_reviewed_by);
        $this->assertNotNull($user->kyc_verified_at);
        $this->putJson('/api/admin/identity-reviews/'.$user->id, ['status' => 'rejected', 'confirmed' => true, 'note' => 'Second review'])->assertUnprocessable();
    }

    public function test_missing_and_unsafe_image_paths_cannot_be_reviewed_or_read(): void
    {
        $user = $this->account();
        $user->update(['id_image_path' => '../outside.jpg']);
        Sanctum::actingAs($this->admin());
        $this->getJson('/api/admin/identity-reviews/'.$user->id.'/image')->assertNotFound();
        $this->putJson('/api/admin/identity-reviews/'.$user->id, ['status' => 'verified', 'confirmed' => true])->assertUnprocessable();
        $this->assertSame('pending', $user->fresh()->kyc_status);
    }

    public function test_legacy_ids_are_verified_before_public_copy_is_removed(): void
    {
        Storage::disk('public')->put('id_images/old.jpg', 'original-image');
        $this->artisan('identity:protect-files', ['--dry-run' => true])->assertSuccessful();
        Storage::disk('public')->assertExists('id_images/old.jpg');
        $this->artisan('identity:protect-files')->assertSuccessful();
        Storage::disk('public')->assertMissing('id_images/old.jpg');
        $this->assertSame('original-image', Storage::disk('local')->get('id_images/old.jpg'));
        Storage::disk('public')->put('id_images/old.jpg', 'different-image');
        $this->artisan('identity:protect-files')->assertFailed();
        Storage::disk('public')->assertExists('id_images/old.jpg');
        $this->assertSame('original-image', Storage::disk('local')->get('id_images/old.jpg'));
    }

    public function test_contact_mail_uses_configured_recipient(): void
    {
        Mail::fake();
        config(['services.contact.recipient' => 'contact@example.com']);
        $this->postJson('/api/public/contact', ['name' => 'Resident', 'email' => 'resident@example.com', 'message' => 'Test message'])->assertOk();
        Mail::assertSent(ContactMessage::class, fn ($mail) => $mail->hasTo('contact@example.com'));
        config(['services.contact.recipient' => null]);
        $this->postJson('/api/public/contact', ['name' => 'Resident', 'email' => 'resident@example.com', 'message' => 'Test message'])->assertStatus(503);
        Mail::assertSentCount(1);
    }

    public function test_public_face_preview_does_not_return_biometrics_and_forwards_authentication(): void
    {
        Http::fake(['*' => Http::response(['match' => true, 'face_encoding' => json_encode(array_fill(0, 128, 0.2))])]);
        $this->postJson('/api/ekyc/verify', ['first_name' => 'Juan', 'last_name' => 'Cruz', 'id_image' => UploadedFile::fake()->image('id.jpg'), 'selfie_image' => UploadedFile::fake()->image('selfie.jpg')])->assertOk()->assertJsonMissingPath('face_encoding');
        Http::assertSent(fn ($request) => $request->hasHeader('X-Service-Key', 'test-service-key'));
    }

    public function test_face_service_errors_and_nonfinite_encodings_fail_closed(): void
    {
        $payload = ['first_name' => 'Juan', 'last_name' => 'Cruz', 'id_image' => UploadedFile::fake()->image('id.jpg'), 'selfie_image' => UploadedFile::fake()->image('selfie.jpg')];
        Http::fake(['*' => Http::sequence()->push(['detail' => 'ID image must contain exactly one clear face.'], 422)->push(['match' => true, 'face_encoding' => '[1e999,'.implode(',', array_fill(0, 127, '0.2')).']'])]);
        $this->postJson('/api/ekyc/verify', $payload)->assertUnprocessable()->assertJsonPath('error', 'ID image must contain exactly one clear face.');
        $this->postJson('/api/ekyc/verify', $payload)->assertStatus(502);
    }
}
