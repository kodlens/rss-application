<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingDevelopment extends Model
{
    protected $primaryKey = 'training_development_id';
    protected $table = 'training_developments';

    protected $fillable = [
        'applicant_id',
        'learning_development',
        'training_date_from',
        'training_date_to',
        'no_hours',
        'conducted_by'
    ];
}
