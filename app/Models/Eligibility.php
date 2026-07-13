<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Eligibility extends Model
{
    protected $primaryKey = 'eligibility_id';
    protected $table = 'eligibilities';

    protected $fillable = [
        'applicant_id',
        'other_eligibility',
        'eligibility',
        'rating',
        'date_exam',
        'place_of_examination'
    ];
}
