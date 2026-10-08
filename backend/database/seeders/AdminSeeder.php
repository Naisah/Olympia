<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = config('bootstrap_admin.email');
        if (Admin::where('email', $email)->exists()) {
            return;
        }
        $password = config('bootstrap_admin.password');
        if (!is_string($password) || strlen($password) < 12) {
            throw new \RuntimeException('Set ADMIN_SEED_PASSWORD to a unique password of at least 12 characters before creating the initial admin.');
        }
        Admin::create([
            'name' => 'Super Admin',
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'admin',
        ]);
    }
}
