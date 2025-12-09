<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pesertas', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('whatsapp')->unique();
            $table->string('otp')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->string('nomor_undian')->nullable(); // Format 00001
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pesertas');
    }
};
