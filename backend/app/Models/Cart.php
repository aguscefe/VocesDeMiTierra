<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Cart extends Model {
 protected $table='carts';
 public $incrementing=false;
 protected $keyType='string';
 public $timestamps=true;
 protected $guarded=[];
 protected function casts(): array { return []; }
 public function items() { return $this->hasMany(CartItem::class); }
}
