<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class CulturalConsent extends Model {
 protected $table='cultural_consents';
 public $incrementing=false;
 protected $keyType='string';
 public $timestamps=false;
 protected $guarded=[];
 protected function casts(): array { return ['expires_at'=>'datetime', 'revoked_at'=>'datetime']; }
 public function product() { return $this->belongsTo(Product::class); }
}
