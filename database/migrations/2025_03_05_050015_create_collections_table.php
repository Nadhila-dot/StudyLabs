<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('collections', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('subject');
            $table->enum('section', ['IGCSE', 'IAL', 'IB', 'SAT']);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('collection_book', function (Blueprint $table) {
            $table->foreignId('collection_id')->constrained()->onDelete('cascade');
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->primary(['collection_id', 'book_id']);
        });

        Schema::create('collection_resource', function (Blueprint $table) {
            $table->foreignId('collection_id')->constrained()->onDelete('cascade');
            $table->foreignId('resource_id')->constrained()->onDelete('cascade');
            $table->primary(['collection_id', 'resource_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('collection_resource');
        Schema::dropIfExists('collection_book');
        Schema::dropIfExists('collections');
    }
};