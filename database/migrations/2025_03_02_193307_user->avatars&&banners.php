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
            // Change column types to LONGTEXT to accommodate base64 encoded images
            if (Schema::hasColumn('users', 'avatar')) {
                $table->longText('avatar')->nullable()->change();
            }
            
            if (Schema::hasColumn('users', 'banner')) {
                $table->longText('banner')->nullable()->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar')->nullable()->change();
            }
            
            if (Schema::hasColumn('users', 'banner')) {
                $table->string('banner')->nullable()->change();
            }
        });
    }
};