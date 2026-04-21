<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('excerpt', 500)->nullable();
            $table->string('category')->nullable();       // Concert, Workshop, etc.
            $table->string('location')->nullable();
            $table->timestamp('start_date');
            $table->timestamp('end_date')->nullable();
            $table->decimal('price', 8, 2)->default(0);
            $table->unsignedInteger('capacity')->nullable(); // null = unlimited
            $table->string('image_url')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->string('recurrence_rule')->nullable();   // iCal RRULE string
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });

        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('quantity')->default(1);
            $table->string('status')->default('confirmed');  // confirmed | cancelled | pending
            $table->boolean('subscribe_recurring')->default(false);
            $table->decimal('amount_paid', 8, 2)->default(0);
            $table->string('stripe_payment_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_registrations');
        Schema::dropIfExists('events');
    }
};
