<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Resident extends Model
{
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'middle_name',
        'date_of_birth',
        'sex',
        'contact_number',
        'email',
        'address',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
