<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Favorite extends Model {
 protected $table='favorites';
 public $incrementing=false;
 protected $keyType='string';
 public $timestamps=false;
 protected $guarded=[];
 protected function casts(): array { return []; }
 public function product() { return $this->belongsTo(Product::class); }
}
