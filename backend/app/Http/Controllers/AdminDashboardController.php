<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\ServiceReservation;
use App\Models\DocumentRequest;
use App\Models\Resident;
use Illuminate\Support\Facades\Mail;
use App\Mail\DocumentStatusUpdated;
use App\Mail\ServiceStatusUpdated;
class AdminDashboardController extends Controller
{
    public function index()
    {
        $healthServices = ServiceReservation::with(['resident', 'service'])
            ->whereHas('service', function ($q) {
                $q->where('category', 'health');
            })->orderBy('created_at', 'desc')->get();
        $facilityServices = ServiceReservation::with(['resident', 'service'])
            ->whereHas('service', function ($q) {
                $q->where('category', 'facility');
            })->orderBy('created_at', 'desc')->get();
        $documentRequests = DocumentRequest::with(['resident', 'documentType'])
            ->orderBy('created_at', 'desc')->get();
        $animalServices = ServiceReservation::with(['resident', 'service'])
            ->whereHas('service', function ($q) {
                $q->where('category', 'animal');
            })->orderBy('created_at', 'desc')->get();
        $philhealthServices = ServiceReservation::with(['resident', 'service'])
            ->whereHas('service', function ($q) {
                $q->where('category', 'philhealth');
            })->orderBy('created_at', 'desc')->get();
        return response()->json([
            'healthQueue' => $healthServices,
            'facilityQueue' => $facilityServices,
            'docsQueue' => $documentRequests,
            'animalQueue' => $animalServices,
            'philhealthQueue' => $philhealthServices,
        ]);
    }
    public function getResidents()
    {
        return response()->json(Resident::orderBy('created_at', 'desc')->get());
    }
    public function updateDocumentStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string|in:Pending,Reviewing,Processing,Ready for Pick-up,Completed,Rejected']);
        $doc = DocumentRequest::findOrFail($id);
        $doc->status = $request->status;
        $doc->save();
        if ($doc->resident && $doc->resident->email) {
            try {
                Mail::to($doc->resident->email)->send(new DocumentStatusUpdated($doc));
            } catch (\Exception $e) {
                \Log::error('Failed to send email: ' . $e->getMessage());
            }
        }
        return response()->json(['message' => 'Document status updated', 'data' => $doc]);
    }
    public function updateServiceStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string|in:Pending,Processing,Approved,Completed,Rejected']);
        $service = \Illuminate\Support\Facades\DB::transaction(function () use ($request, $id) {
            $reservation = ServiceReservation::findOrFail($id);
            $service = \App\Models\Service::whereKey($reservation->service_id)->lockForUpdate()->firstOrFail();
            $reservation->refresh();
            if ($service->name === 'Covered Court' && in_array($request->status, ['Pending', 'Processing', 'Approved', 'Completed'])) {
                $conflict = ServiceReservation::where('service_id', $service->id)
                    ->where('reservation_date', $reservation->reservation_date)
                    ->where('id', '!=', $reservation->id)
                    ->whereIn('status', ['Pending', 'Processing', 'Approved', 'Completed'])->exists();
                if ($conflict) {
                    throw \Illuminate\Validation\ValidationException::withMessages(['status' => 'Another reservation occupies this court slot.']);
                }
            }
            $reservation->update(['status' => $request->status]);
            return $reservation;
        });
        if ($service->resident && $service->resident->email) {
            try {
                Mail::to($service->resident->email)->send(new ServiceStatusUpdated($service));
            } catch (\Exception $e) {
                \Log::error('Failed to send email: ' . $e->getMessage());
            }
        }
        return response()->json(['message' => 'Service status updated', 'data' => $service]);
    }
}
