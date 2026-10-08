<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('document_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_type_id')->constrained('document_types')->onDelete('cascade');
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->string('purpose');
            $table->string('tracking_number')->unique();
            $table->string('status')->default('Pending');
            $table->unsignedBigInteger('processed_by_user_id')->nullable();
            $table->foreign('processed_by_user_id')->references('id')->on('admin')->onDelete('set null');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('document_requests');
    }
};
