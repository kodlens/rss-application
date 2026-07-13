<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EducationalBackground extends Model
{
    protected $primaryKey = 'educational_background_id';
    protected $table = 'educational_backgrounds';

    protected $fillable = [
        'applicant_id',
        'level',
        'name_of_school',
        'education_description',
        'year_graduated'
    ];
}
