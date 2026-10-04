<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class SupportTicket extends Model {
 protected $table='support_tickets';
 public $incrementing=false;
 protected $keyType='string';
 public $timestamps=true;
 protected $guarded=[];
 protected function casts(): array { return []; }
 public function user() { return $this->belongsTo(User::class); }
}
