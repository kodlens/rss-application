<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobPosition extends Model
{
    protected $primaryKey = 'job_position_id';
    protected $table = 'job_positions';

    protected $fillable = [
        'job_position_title',
        'job_post_expiry',
        'status_engagement_id',
        'job_position_code',
        'division_id',
        'section_id',
        'salary',
        'salary_grade_id',
        //'no_vacancy',
        'deadline_submission',
        'job_requirements',
        'job_description',

        'job_position_slug',
        'is_open',
        'post_signature',
        'system_user',
        'is_active',
        'is_open',
        'is_apply_score_matrix',
        'pin'

    ];


    public function division(){
        return $this->hasOne(Division::class, 'id', 'division_id');
    }

    public function section(){
        return $this->hasOne(Section::class, 'id', 'section_id');
    }

    public function salary_grade(){
        return $this->hasOne(SalaryGrade::class, 'salary_grade_id', 'salary_grade_id');
    }

    public function status_engagement(){
        return $this->hasOne(StatusEngagement::class, 'status_engagement_id', 'status_engagement_id');
    }
}
