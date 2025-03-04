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
            $table->integer('level')->default(1);
            $table->json('prizes')->nullable();
            $table->json('rank')->nullable();
            $table->boolean('is_admin')->default(false);
            $table->timestamp('last_seen')->nullable();
            $table->json('streak')->nullable();
            $table->json('description')->nullable();
            $table->boolean('is_team')->default(false);
            $table->string('banner')->nullable();
            $table->boolean('ban')->default(false);
            $table->string('avatar')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'level',
                'prizes',
                'rank',
                'is_admin',
                'last_seen',
                'streak',
                'description',
                'is_team',
                'banner',
                'ban',
                'avatar',
            ]);
        });
    }
};