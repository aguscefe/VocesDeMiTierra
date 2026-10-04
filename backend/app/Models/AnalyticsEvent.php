<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class AnalyticsEvent extends Model {
 protected $table='analytics_events';
 public $incrementing=true;
 protected $keyType='int';
 public $timestamps=false;
 protected $guarded=[];
 protected function casts(): array { return []; }
 
}
