<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class QrCode extends Model {
 protected $table='qr_codes';
 public $incrementing=false;
 protected $keyType='string';
 public $timestamps=false;
 protected $guarded=[];
 protected function casts(): array { return ['active'=>'boolean', 'scans'=>'integer', 'last_scan'=>'datetime']; }
 public function product() { return $this->belongsTo(Product::class); }
}
