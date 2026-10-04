<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class AuditLog extends Model {
 protected $table='audit_logs';
 public $incrementing=true;
 protected $keyType='int';
 public $timestamps=false;
 protected $guarded=[];
 protected function casts(): array { return []; }
 
}
