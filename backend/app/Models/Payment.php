<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Payment extends Model {
 protected $table='payments';
 public $incrementing=false;
 protected $keyType='string';
 public $timestamps=false;
 protected $guarded=[];
 protected function casts(): array { return ['amount'=>'float', 'is_simulated'=>'boolean']; }
 public function order() { return $this->belongsTo(Order::class); }
}
