<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class OrderItem extends Model {
 protected $table='order_items';
 public $incrementing=true;
 protected $keyType='int';
 public $timestamps=false;
 protected $guarded=[];
 protected function casts(): array { return ['quantity'=>'integer', 'unit_price'=>'float']; }
 public function order() { return $this->belongsTo(Order::class); }
 public function product() { return $this->belongsTo(Product::class); }
}
