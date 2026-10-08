<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('face_encoding')->nullable()->after('password');
            $table->string('id_image_path')->nullable()->after('face_encoding');
            $table->enum('kyc_status', ['pending', 'verified', 'rejected'])->default('pending')->after('id_image_path');
            $table->timestamp('kyc_verified_at')->nullable()->after('kyc_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['face_encoding', 'id_image_path', 'kyc_status', 'kyc_verified_at']);
        });
    }
};
