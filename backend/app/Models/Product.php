<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'materials' => 'array',
            'gallery' => 'array',
            'price' => 'decimal:2',
            'package_weight' => 'decimal:3',
        ];
    }

    public function producer(): BelongsTo
    {
        return $this->belongsTo(ProducerProfile::class, 'producer_id');
    }

    public function culturalRecord(): HasOne
    {
        return $this->hasOne(CulturalRecord::class);
    }
}
