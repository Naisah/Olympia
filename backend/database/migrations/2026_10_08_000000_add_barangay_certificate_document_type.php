<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        if (!DB::table('document_types')->where('name', 'Barangay Certificate')->exists()) {
            DB::table('document_types')->insert(['name' => 'Barangay Certificate', 'created_at' => now(), 'updated_at' => now()]);
        }
    }

    public function down(): void
    {
        // Keep existing document types and requests on rollback.
    }
};
