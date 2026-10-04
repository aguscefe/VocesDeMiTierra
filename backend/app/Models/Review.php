<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Review extends Model {
 protected $table='reviews';
 public $incrementing=false;
 protected $keyType='string';
 public $timestamps=false;
 protected $guarded=[];
 protected function casts(): array { return ['rating'=>'integer']; }
 public function product() { return $this->belongsTo(Product::class); }
}
