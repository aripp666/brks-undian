<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Peserta extends Model
{
    protected $fillable = [
        'nama',
        'whatsapp',
        'otp',
        'is_verified',
        'nomor_undian'
    ];
}
