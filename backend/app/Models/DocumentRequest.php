<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class DocumentRequest extends Model
{
    protected $fillable = [
        'resident_id',
        'document_type_id',
        'tracking_number',
        'purpose',
        'status',
        'processed_by_user_id',
    ];
    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }
    public function documentType()
    {
        return $this->belongsTo(DocumentType::class);
    }
}
