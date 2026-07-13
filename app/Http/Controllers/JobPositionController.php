<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JobPosition;

class JobPositionController extends Controller
{
    public function getJobPositions(Request $req) {
        $perpage = $req->perpage ?? 10;
        $data = JobPosition::with([
            'division' => function($q) {
                $q->select('id', 'division_name', 'division_code');
            },
            'section' => function($q) {
                $q->select('id', 'section_name', 'section_code');
            },
            'salary_grade' => function ($q) {
                $q->select('salary_grade_id', 'salary_grade');
            },
            'status_engagement' =>  function ($q) {
                $q->select('status_engagement_id', 'status_engagement');
            }
        ])
        ->orderBy('created_at', 'desc')->paginate($perpage);

        return response()->json([
            'data' => $data,
            'success' => true,
            'message' => 'Job positions fetched successfully'
        ]);
    }
}
