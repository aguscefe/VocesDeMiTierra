<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
 public function up(): void {
  Schema::table('users',fn(Blueprint $t)=>[$t->string('delivery_address',1000)->nullable(),$t->string('delivery_postal',5)->nullable()]);
  Schema::table('producer_profiles',fn(Blueprint $t)=>$t->string('shipping_address',1000)->nullable());
  Schema::table('orders',fn(Blueprint $t)=>$t->string('origin_address',1000)->nullable());
 }
 public function down(): void {
  Schema::table('orders',fn(Blueprint $t)=>$t->dropColumn('origin_address'));
  Schema::table('producer_profiles',fn(Blueprint $t)=>$t->dropColumn('shipping_address'));
  Schema::table('users',fn(Blueprint $t)=>$t->dropColumn(['delivery_address','delivery_postal']));
 }
};
