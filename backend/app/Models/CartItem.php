<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class CartItem extends Model {
 protected $table='cart_items';
 public $incrementing=true;
 protected $keyType='int';
 public $timestamps=false;
 protected $guarded=[];
 protected function casts(): array { return ['quantity'=>'integer', 'unit_price'=>'float']; }
 public function product() { return $this->belongsTo(Product::class); }
}
