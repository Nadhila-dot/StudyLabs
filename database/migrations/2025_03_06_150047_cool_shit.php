<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('posts', function (Blueprint $table) {
        $table->longText('featured_image')->nullable()->change();
    });
}
    
    public function down()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('featured_image')->nullable()->change();
        });
    }
};
