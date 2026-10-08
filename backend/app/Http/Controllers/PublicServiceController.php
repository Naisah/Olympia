<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Resident;
use App\Models\ServiceReservation;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\DocumentRequestConfirmation;
use App\Mail\ServiceReservationConfirmation;
class PublicServiceController extends Controller
{
    public function getServiceSchedule(Request $request, $serviceName)
    {
        $service = Service::where('name', urldecode($serviceName))->first();
        if (!$service) {
            return response()->json([]);
        }
        $reservations = ServiceReservation::where('service_id', $service->id)
            ->whereIn('status', ['Pending', 'Processing', 'Approved', 'Completed'])
            ->orderBy('created_at', 'desc')
            ->get(['reservation_date', 'status']);
        return response()->json($reservations);
    }
    public function reserve(Request $request)
    {
        $data = $request->validate(array_merge($this->residentRules(), [
            'service_name' => 'required_without:service_id|nullable|string|exists:services,name',
            'service_id' => 'required_without:service_name|nullable|integer|exists:services,id',
            'reservation_date' => ['required', 'string', 'max:255', new \App\Rules\ReservationDate],
            'purpose' => 'nullable|string|max:255',
        ]));
        [$service, $resident, $reservation] = \Illuminate\Support\Facades\DB::transaction(function () use ($data) {
            $query = Service::query();
            if (!empty($data['service_name'])) $query->where('name', $data['service_name']);
            if (!empty($data['service_id'])) $query->where('id', $data['service_id']);
            $service = $query->lockForUpdate()->first();
            if (!$service) throw \Illuminate\Validation\ValidationException::withMessages(['service_name' => 'Service not found.']);
            if ($service->name === 'Covered Court') {
                if (!preg_match('/^[A-Za-z]+, [A-Za-z]+ \d{1,2}, \d{4} (\d{2}:00 [AP]M - \d{2}:00 [AP]M)$/', $data['reservation_date'], $matches)) {
                    throw \Illuminate\Validation\ValidationException::withMessages(['reservation_date' => 'Select a valid court time slot.']);
                }
                $slot = $matches[1];
                $slots = ['06:00 AM - 08:00 AM', '08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '12:00 PM - 02:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM', '06:00 PM - 08:00 PM', '08:00 PM - 10:00 PM'];
                $day = (int) date('w', strtotime(substr($data['reservation_date'], 0, -strlen($slot))));
                $community = ($slot === $slots[0] && in_array($day, [1, 3, 5])) || (in_array($slot, array_slice($slots, 5)) && in_array($day, [0, 2, 4, 6]));
                if (!in_array($slot, $slots) || $community) throw \Illuminate\Validation\ValidationException::withMessages(['reservation_date' => 'This court slot is unavailable.']);
                $booked = ServiceReservation::where('service_id', $service->id)->where('reservation_date', $data['reservation_date'])->whereIn('status', ['Pending', 'Processing', 'Approved', 'Completed'])->exists();
                if ($booked) throw \Illuminate\Validation\ValidationException::withMessages(['reservation_date' => 'This court slot is already reserved.']);
            }
            // Guest requests must not attach to or overwrite an account based on an unverified email.
            $resident = Resident::create(collect($data)->only(array_keys($this->residentRules()))->all());
            $reservation = ServiceReservation::create([
                'resident_id' => $resident->id,
                'service_id' => $service->id,
                'tracking_number' => 'SRV-' . strtoupper(Str::random(8)),
                'reservation_date' => $data['reservation_date'],
                'purpose' => $data['purpose'] ?? null,
                'status' => 'Pending',
            ]);
            return [$service, $resident, $reservation];
        });

        // Send confirmation email if resident has an email
        if ($resident->email) {
            try {
                Mail::to($resident->email)->send(new ServiceReservationConfirmation(
                    firstName: $resident->first_name,
                    serviceName: $service->name,
                    reservationDate: $request->reservation_date,
                    trackingNumber: $reservation->tracking_number,
                ));
            } catch (\Exception $e) {
                \Log::warning('Failed to send reservation email: ' . $e->getMessage());
            }
        }

        return response()->json([
            'message' => 'Reservation submitted successfully',
            'tracking_number' => $reservation->tracking_number,
        ], 201);
    }
    public function requestDocument(Request $request)
    {
        $data = $request->validate(array_merge($this->residentRules(), [
            'document_name' => 'required|string|exists:document_types,name',
            'purpose' => 'required|string|max:255',
            'sex' => 'required_if:document_name,Barangay ID|nullable|in:Male,Female',
            'dob' => 'required_if:document_name,Barangay ID|nullable|date_format:Y-m-d|before_or_equal:today',
        ]));
        [$resident, $docRequest] = \Illuminate\Support\Facades\DB::transaction(function () use ($data) {
            $resident = Resident::create(array_merge(collect($data)->only(array_keys($this->residentRules()))->all(), [
                'sex' => $data['sex'] ?? null,
                'date_of_birth' => $data['dob'] ?? null,
            ]));
            $docType = \App\Models\DocumentType::where('name', $data['document_name'])->firstOrFail();
            $docRequest = \App\Models\DocumentRequest::create([
                'resident_id' => $resident->id,
                'document_type_id' => $docType->id,
                'tracking_number' => 'DOC-' . strtoupper(Str::random(8)),
                'purpose' => $data['purpose'],
                'status' => 'Pending',
            ]);
            return [$resident, $docRequest];
        });

        // Send confirmation email if resident has an email
        if ($resident->email) {
            try {
                Mail::to($resident->email)->send(new DocumentRequestConfirmation(
                    firstName: $resident->first_name,
                    documentName: $request->document_name,
                    trackingNumber: $docRequest->tracking_number,
                ));
            } catch (\Exception $e) {
                \Log::warning('Failed to send document email: ' . $e->getMessage());
            }
        }

        return response()->json([
            'message' => 'Document requested successfully',
            'tracking_number' => $docRequest->tracking_number,
        ], 201);
    }
    private function residentRules(): array
    {
        return [
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'address' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'contact_number' => ['required', 'string', 'regex:/^(09|\\+639)\\d{9}$/'],
        ];
    }
}
