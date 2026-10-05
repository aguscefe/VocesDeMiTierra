<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Order extends Model {
 protected $table='orders';
 public $incrementing=false;
 protected $keyType='string';
 public $timestamps=true;
 protected $guarded=[];
 protected function casts(): array { return ['subtotal'=>'float', 'shipping'=>'float', 'total'=>'float', 'platform_commission'=>'float', 'producer_net'=>'float', 'processing_cost'=>'float']; }
 public function items() { return $this->hasMany(OrderItem::class); }
 public function buyer() { return $this->belongsTo(User::class, 'consumer_id'); }
 public function producer() { return $this->belongsTo(ProducerProfile::class, 'producer_id'); }
 public function payments() { return $this->hasMany(Payment::class); }
}
