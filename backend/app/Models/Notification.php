<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Notification extends Model {
 protected $table='notifications';
 public $incrementing=false;
 protected $keyType='string';
 public $timestamps=false;
 protected $guarded=[];
 protected function casts(): array { return ['is_read'=>'boolean']; }
 public function user() { return $this->belongsTo(User::class); }
}
