<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('admin_has_document_requests', function (Blueprint $table) {
            $table->unsignedBigInteger('admin_id');
            $table->unsignedBigInteger('document_requests_id');
            $table->foreign('admin_id')->references('id')->on('admin')->onDelete('cascade');
            $table->foreign('document_requests_id')->references('id')->on('document_requests')->onDelete('cascade');
            $table->primary(['admin_id', 'document_requests_id']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('admin_has_document_requests');
    }
};
