<?php
namespace App\Models;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $fillable = [
        'name',
        'email',
        'password',
        'face_encoding',
        'id_image_path',
        'id_back_image_path',
        'kyc_status',
        'id_type',
        'kyc_verified_at',
    ];
    protected $hidden = [
        'face_encoding',
        'id_image_path',
        'id_back_image_path',
        'password',
        'remember_token',
    ];
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function resident()
    {
        return $this->hasOne(Resident::class);
    }
}
