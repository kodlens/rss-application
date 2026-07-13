<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    protected $primaryKey = 'office_id';
    protected $table = 'offices';

    protected $fillable = [
        'office',
        'office_description',
        'active'
    ];
}
