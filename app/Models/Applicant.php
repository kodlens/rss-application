<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Applicant extends Model
{
    protected $table = 'applicants';
    protected $primaryKey = 'applicant_id';


    protected $fillable = [
        'job_position_id',
        'job_position_slug',

        'lname',

        'fname',
        'mname',
        'sex',
        'email',
        'contact_no',
        'ethnicity',
        'religion',

        'civil_status',
        'citizenship',

        // 'educational_background',
        // 'eligibility',
        // 'previous_work_exp',
        // 'training_learning_dev',

        'attachment_path',
        'application_letter',
        'pds',
        'diploma',
        'transcript_record',
        'relevant_training',
        'certificate_employment',

        'hr_status',
        'datetime_hr_marked',

        'head_status',
        'datetime_head_marked',

        'section_id',
        'division_id',

        'is_hr_decline',
        'datetime_hr_decline',

        'is_scored',
        'datetime_scored',

        'is_head_decline',
        'datetime_head_decline',

        'is_accepted',
        'datetime_accepted',

        'province',
        'city',
        'barangay',
        'street',
        'zipcode',

        'is_exam',
        'datetime_exam',

        //for applicant score
        'exam',
        'interview',
        'education',
        'relevant_experience',
        'personal_qualities',



        'gdrive_link',

        'pds_link',
        'work_ex_link',
        'coe_link',
        'tor_link',
        'performance_rating_link',
        'cert_of_eligibility_link',
        'cert_of_award_link',
        'application_letter_link',
        'cert_of_relevant_training_link'
    ];


    public function province(){
        return $this->hasOne(Province::class, 'provCode', 'province');
    }

    public function city(){
        return $this->hasOne(City::class, 'citymunCode', 'city');
    }

    public function barangay(){
        return $this->hasOne(Barangay::class, 'brgyCode', 'barangay');
    }

    public function section(){
        return $this->hasOne(Section::class, 'id', 'section_id');
    }

    public function division(){
        return $this->hasOne(Division::class, 'id', 'division_id');
    }


    public function educational_backgrounds(){
        return $this->hasMany(EducationalBackground::class, 'applicant_id');
    }

    public function eligibilities(){
        return $this->hasMany(Eligibility::class, 'applicant_id');
    }

    public function work_experiences(){
        return $this->hasMany(WorkExperience::class, 'applicant_id');
    }

    public function training_developments(){
        return $this->hasMany(TrainingDevelopment::class, 'applicant_id');
    }

    public function job_position(){
        return $this->hasOne(JobPosition::class, 'job_position_id', 'job_position_id');
    }
}
