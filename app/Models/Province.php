<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    protected $table = 'provinces';
    protected $primaryKey = 'id';


    protected $fillable = ['psgcCode', 'provDesc', 'regCode', 'provCode', 'active'];
}
