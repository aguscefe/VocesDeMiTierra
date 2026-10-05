<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
 public function up(): void {
  Schema::create('product_certificates', function(Blueprint $t) {
   $t->string('id',100)->primary();
   $t->string('producer_id',100)->index();
   $t->string('product_id',100)->nullable()->unique();
   $t->string('path',500);
   $t->string('original_name',255);
   $t->string('mime_type',100);
   $t->string('status',20)->default('uploaded')->index();
   $t->text('review_notes')->nullable();
   $t->string('reviewed_by',100)->nullable();
   $t->timestamp('reviewed_at')->nullable();
   $t->timestamps();
  });
 }
 public function down(): void { Schema::dropIfExists('product_certificates'); }
};
