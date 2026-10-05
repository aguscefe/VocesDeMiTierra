<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
return new class extends Migration {
 public function up(): void { DB::statement("ALTER TABLE payments MODIFY method ENUM('card','transfer','pending','paypal') NOT NULL DEFAULT 'pending'"); }
 public function down(): void { DB::table('payments')->where('method','paypal')->update(['method'=>'transfer']); DB::statement("ALTER TABLE payments MODIFY method ENUM('card','transfer','pending') NOT NULL DEFAULT 'pending'"); }
};
