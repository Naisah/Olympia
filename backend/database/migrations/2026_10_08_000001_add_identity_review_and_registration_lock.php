<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('registration_locks', function (Blueprint $table) {
            $table->unsignedTinyInteger('id')->primary();
        });
        DB::table('registration_locks')->insert(['id' => 1]);
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('kyc_reviewed_by')->nullable()->constrained('admin')->nullOnDelete();
            $table->timestamp('kyc_reviewed_at')->nullable();
            $table->text('kyc_review_note')->nullable();
            $table->string('id_back_image_path')->nullable();
            $table->string('id_type', 50)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('kyc_reviewed_by');
            $table->dropColumn(['kyc_reviewed_at', 'kyc_review_note', 'id_back_image_path', 'id_type']);
        });
        Schema::dropIfExists('registration_locks');
    }
};
