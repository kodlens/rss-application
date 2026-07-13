<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalaryGrade extends Model
{
    protected $primaryKey = 'salary_grade_id';
    protected $table = 'salary_grades';

    protected $fillable = [
        'salary_grade',
    ];
}
