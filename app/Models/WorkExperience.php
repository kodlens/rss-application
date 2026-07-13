<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkExperience extends Model
{
    protected $primaryKey = 'work_experience_id';
    protected $table = 'work_experiences';

    protected $fillable = [
        'applicant_id',
        'position_title',
        'company_name',
        'inclusive_date_from',
        'inclusive_date_to',
        'no_years_experience'
    ];
}
