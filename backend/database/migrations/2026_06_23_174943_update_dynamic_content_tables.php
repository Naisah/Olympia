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
        Schema::table('businesses', function (Blueprint $table) {
            $table->string('category')->nullable()->after('id');
            $table->string('maps_url')->nullable()->after('image_url');
            $table->json('details')->nullable()->after('description');
        });

        Schema::table('news', function (Blueprint $table) {
            $table->boolean('is_featured')->default(false)->after('image_url');
            // We change published_date to string to allow ranges like 'May 11 - 29, 2026'
            $table->string('published_date_string')->nullable()->after('published_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->dropColumn(['category', 'maps_url', 'details']);
        });

        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn(['is_featured', 'published_date_string']);
        });
    }
};
