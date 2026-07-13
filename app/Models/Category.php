<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';

    protected $fillable = [
        'slug',
        'category',
        'active'
    ];

    public function subject_headings(){
        return $this->hasMany(SubjectHeading::class);
    }
}
