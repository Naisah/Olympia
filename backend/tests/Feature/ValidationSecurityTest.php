<?php

namespace Tests\Feature;

use App\Models\{Admin, User, Resident, Service, ServiceReservation, DocumentRequest, DocumentType};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\{Http, Mail, Storage};
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ValidationSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.face_verification.key' => 'test-service-key']);
        Http::preventStrayRequests();
    }

    private function residentData(): array
    {
        return ['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'email' => 'juan@example.com', 'address' => 'Olympia', 'contact_number' => '09123456789'];
    }

    public function test_admin_seeding_requires_configured_password(): void
    {
        config(['bootstrap_admin.password' => null]);
        $this->expectException(\RuntimeException::class);
        $this->seed(\Database\Seeders\AdminSeeder::class);
    }

    public function test_admin_seeding_does_not_reset_existing_password(): void
    {
        config(['bootstrap_admin.password' => 'UniquePassword123']);
        $this->seed(\Database\Seeders\AdminSeeder::class);
        config(['bootstrap_admin.password' => 'DifferentPassword123']);
        $this->seed(\Database\Seeders\AdminSeeder::class);
        $this->assertDatabaseCount('admin', 1);
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('UniquePassword123', Admin::first()->password));
    }

    public function test_resident_cannot_use_admin_routes(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $this->getJson('/api/admin/dashboard')->assertForbidden();
        $this->getJson('/api/admin/residents')->assertForbidden();
        $this->postJson('/api/admin/content/news', [])->assertForbidden();
        $this->getJson('/api/user')->assertForbidden();
    }

    public function test_admin_cannot_use_resident_profile_routes(): void
    {
        $admin = Admin::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => 'Password123']);
        Sanctum::actingAs($admin);
        $this->getJson('/api/user/me')->assertForbidden();
        $this->getJson('/api/admin/dashboard')->assertOk();
        $this->putJson('/api/admin/document/1/status', ['status' => 'invalid'])->assertUnprocessable();
        $this->putJson('/api/admin/service/1/status', ['status' => 'invalid'])->assertUnprocessable();
    }

    public function test_registration_validates_and_persists_real_account_without_exposing_biometrics(): void
    {
        Storage::fake('local');
        Http::fake(['*' => Http::response(['match' => true, 'face_encoding' => json_encode(array_fill(0, 128, 0.2))])]);
        $this->postJson('/api/user/register', [])->assertUnprocessable();
        $payload = array_merge($this->residentData(), [
            'password' => 'Password123', 'password_confirmation' => 'Password123',
            'id_image' => UploadedFile::fake()->image('id.jpg'),
            'selfie_image' => UploadedFile::fake()->image('selfie.jpg'),
            'face_encoding' => 'forged',
        ]);
        $this->postJson('/api/user/register', $payload)->assertCreated()->assertJsonStructure(['token', 'user' => ['resident']])->assertJsonMissingPath('user.face_encoding')->assertJsonMissingPath('user.id_image_path');
        $user = User::firstOrFail();
        $this->assertSame(json_encode(array_fill(0, 128, 0.2)), $user->face_encoding);
        Storage::disk('local')->assertExists($user->id_image_path);
        $this->assertDatabaseCount('residents', 1);
        $this->postJson('/api/user/login', ['email' => 'juan@example.com', 'password' => 'Password123'])->assertOk();
        $payload['email'] = 'second@example.com';
        $this->postJson('/api/user/register', $payload)->assertForbidden();
        $this->assertDatabaseCount('users', 1);
    }

    public function test_public_requests_validate_before_writing(): void
    {
        $this->postJson('/api/public/service/reserve', [])->assertUnprocessable();
        $this->postJson('/api/public/document/request', [])->assertUnprocessable();
        Service::create(['name' => 'Medical Consult', 'category' => 'health']);
        $this->postJson('/api/public/service/reserve', array_merge($this->residentData(), ['service_name' => 'Medical Consult', 'reservation_date' => '2000-01-01 (8am - 9am)']))->assertUnprocessable();
        $this->assertDatabaseCount('residents', 0);
        $this->assertDatabaseCount('service_reservations', 0);
    }

    public function test_guest_request_does_not_modify_existing_resident(): void
    {
        Mail::fake();
        $resident = Resident::create(array_merge($this->residentData(), ['sex' => 'Male']));
        DocumentType::create(['name' => 'Barangay ID']);
        $this->postJson('/api/public/document/request', array_merge($this->residentData(), ['document_name' => 'Barangay ID', 'purpose' => 'ID', 'sex' => 'Female', 'dob' => '2000-01-01']))->assertCreated();
        $this->assertSame('Male', $resident->fresh()->sex);
        $this->assertNotEquals($resident->id, DocumentRequest::first()->resident_id);
    }

    public function test_court_conflicts_and_schedule_privacy(): void
    {
        Mail::fake();
        Service::create(['name' => 'Covered Court', 'category' => 'facility']);
        $payload = array_merge($this->residentData(), ['service_name' => 'Covered Court', 'reservation_date' => now('Asia/Manila')->addDay()->format('l, F j, Y') . ' 08:00 AM - 10:00 AM', 'purpose' => 'Private event']);
        $this->postJson('/api/public/service/reserve', $payload)->assertCreated();
        $this->postJson('/api/public/service/reserve', $payload)->assertUnprocessable();
        $this->assertDatabaseCount('service_reservations', 1);
        $this->assertDatabaseCount('residents', 1);
        $this->getJson('/api/public/service/Covered%20Court/schedule')->assertOk()->assertJsonCount(1)->assertJsonMissingPath('0.resident_id')->assertJsonMissingPath('0.purpose')->assertJsonMissingPath('0.tracking_number');
    }

    public function test_content_does_not_accept_unvalidated_columns(): void
    {
        Sanctum::actingAs(Admin::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => 'Password123']));
        $this->postJson('/api/admin/content/news', ['title' => 'News', 'published_date_string' => 'Today', 'content' => 'Notice', 'link' => 'https://example.com', 'id' => 999, 'image_url' => '/storage/private.jpg'])->assertOk();
        $this->assertDatabaseMissing('news', ['id' => 999]);
        $this->assertDatabaseHas('news', ['title' => 'News', 'image_url' => null]);
    }

    public function test_all_service_date_formats_and_invalid_calendar_dates(): void
    {
        Mail::fake();
        Service::create(['name' => 'Animal Care', 'category' => 'animal']);
        Service::create(['name' => 'Vaccination', 'category' => 'health']);
        $date = now('Asia/Manila')->addDay()->format('Y-m-d');
        $this->postJson('/api/public/service/reserve', array_merge($this->residentData(), ['service_name' => 'Animal Care', 'reservation_date' => $date]))->assertCreated();
        $this->postJson('/api/public/service/reserve', array_merge($this->residentData(), ['service_name' => 'Vaccination', 'reservation_date' => $date . ' (3pm - 4pm)']))->assertCreated();
        $this->postJson('/api/public/service/reserve', array_merge($this->residentData(), ['service_name' => 'Vaccination', 'reservation_date' => '2099-02-30 (8am - 9am)']))->assertUnprocessable();
        $this->postJson('/api/public/service/reserve', array_merge($this->residentData(), ['service_name' => 'Invented Service', 'reservation_date' => $date]))->assertUnprocessable();
        $this->assertDatabaseCount('service_reservations', 2);
    }

    public function test_rejected_court_booking_cannot_reclaim_an_occupied_slot(): void
    {
        Mail::fake();
        $service = Service::create(['name' => 'Covered Court', 'category' => 'facility']);
        $resident = Resident::create($this->residentData());
        $date = now('Asia/Manila')->addDay()->format('l, F j, Y') . ' 08:00 AM - 10:00 AM';
        $rejected = ServiceReservation::create(['service_id' => $service->id, 'resident_id' => $resident->id, 'tracking_number' => 'OLD', 'reservation_date' => $date, 'status' => 'Rejected']);
        $this->postJson('/api/public/service/reserve', array_merge($this->residentData(), ['service_name' => 'Covered Court', 'reservation_date' => $date]))->assertCreated();
        Sanctum::actingAs(Admin::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => 'Password123']));
        $this->putJson('/api/admin/service/' . $rejected->id . '/status', ['status' => 'Approved'])->assertUnprocessable();
        $this->assertSame('Rejected', $rejected->fresh()->status);
    }
}
