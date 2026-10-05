<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Shipment extends Model {
 protected $table='shipments';
 public $incrementing=false;
 protected $keyType='string';
 public $timestamps=false;
 protected $guarded=[];
 protected function casts(): array { return ['shipped_at'=>'datetime', 'delivered_at'=>'datetime']; }
 public function order() { return $this->belongsTo(Order::class); }
}
