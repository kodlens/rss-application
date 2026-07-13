<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JobPosition;

class JobPositionController extends Controller
{
    public function getJobPositions(Request $req) {
        $perpage = $req->perpage ?? 10;
        $data = JobPosition::orderBy('created_at', 'desc')->paginate($perpage);

        return response()->json([
            'data' => $data,
            'success' => true,
            'message' => 'Job positions fetched successfully'
        ]);
    }
}
