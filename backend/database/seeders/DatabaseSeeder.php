<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\DocumentType;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            ContentSeeder::class,
        ]);

        Service::insert([
            ['name' => 'Covered Court', 'category' => 'facility'],
            ['name' => 'Maternal Care', 'category' => 'health'],
            ['name' => 'Animal Care', 'category' => 'animal'],
            ['name' => 'Medical Consult', 'category' => 'health'],
            ['name' => 'Vaccination', 'category' => 'health'],
            ['name' => 'Mental Health', 'category' => 'health'],
            ['name' => 'PhilHealth', 'category' => 'philhealth'],
        ]);

        DocumentType::insert([
            ['name' => 'Barangay Clearance'],
            ['name' => 'Certificate of Indigency'],
            ['name' => 'Barangay ID'],
            ['name' => 'Business Permit'],
        ]);
    }
}
