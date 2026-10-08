<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ServiceReservation extends Model
{
    protected $fillable = [
        'resident_id',
        'service_id',
        'tracking_number',
        'reservation_date',
        'purpose',
        'status',
    ];
    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
