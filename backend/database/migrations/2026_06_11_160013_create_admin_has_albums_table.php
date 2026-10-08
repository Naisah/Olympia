<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('admin_has_albums', function (Blueprint $table) {
            $table->unsignedBigInteger('admin_id');
            $table->unsignedBigInteger('albums_id');
            $table->foreign('admin_id')->references('id')->on('admin')->onDelete('cascade');
            $table->foreign('albums_id')->references('id')->on('albums')->onDelete('cascade');
            $table->primary(['admin_id', 'albums_id']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('admin_has_albums');
    }
};
