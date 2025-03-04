_table.php
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
            // Add new columns if they don't exist
            if (!Schema::hasColumn('users', 'level')) {
                $table->integer('level')->default(1);
            }
            if (!Schema::hasColumn('users', 'prizes')) {
                $table->text('prizes')->nullable(); // Stored as serialized array
            }
            if (!Schema::hasColumn('users', 'rank')) {
                $table->text('rank')->nullable(); // Stored as serialized array
            }
            if (!Schema::hasColumn('users', 'is_admin')) {
                $table->boolean('is_admin')->default(false);
            }
            if (!Schema::hasColumn('users', 'last_seen')) {
                $table->timestamp('last_seen')->nullable();
            }
            if (!Schema::hasColumn('users', 'streak')) {
                $table->text('streak')->nullable(); // Stored as serialized array
            }
            if (!Schema::hasColumn('users', 'description')) {
                $table->string('description')->nullable();
            }
            if (!Schema::hasColumn('users', 'is_team')) {
                $table->boolean('is_team')->default(false);
            }
            if (!Schema::hasColumn('users', 'banner')) {
                $table->string('banner')->nullable();
            }
            if (!Schema::hasColumn('users', 'ban')) {
                $table->boolean('ban')->default(false);
            }
            if (!Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop the columns
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
                'avatar'
            ]);
        });
    }
};