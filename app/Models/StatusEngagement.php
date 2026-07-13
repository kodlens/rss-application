<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StatusEngagement extends Model
{
    protected $table = 'status_engagements';
    protected $primaryKey = 'status_engagement_id';

    protected $fillable = [
        'status_engagement',
        'active',
    ];
}
