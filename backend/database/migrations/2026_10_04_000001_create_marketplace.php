<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
return new class extends Migration {
 public function up(): void {
  if (DB::getDriverName() !== 'mysql') throw new RuntimeException('Esta migración requiere MariaDB/MySQL.');
  $sql = preg_replace('/--[^\n]*/', '', file_get_contents(database_path('schema.sql')));
  foreach (explode(';', $sql) as $statement) if (trim($statement)) DB::statement($statement);
 }
 public function down(): void {
  DB::statement('SET FOREIGN_KEY_CHECKS=0');
  foreach (["audit_logs", "analytics_events", "shipments", "support_tickets", "cart_items", "carts", "favorites", "qr_codes", "notifications", "reviews", "payments", "order_items", "orders", "cultural_records", "cultural_consents", "products", "producer_profiles", "users"] as $table) DB::statement("DROP TABLE IF EXISTS `$table`");
  DB::statement('SET FOREIGN_KEY_CHECKS=1');
 }
};
