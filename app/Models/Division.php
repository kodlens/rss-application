<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
    //Division Model
    //Coded in DOST-STII
    //Nov 08, 2023
    //Ampz

    protected $primaryKey = 'id';
    protected $table = 'divisions';

    protected $fillable = [
        'division_name',
        'division_code',
    ];

}
