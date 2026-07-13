<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


    Route::get('/get-job-positions', [App\Http\Controllers\JobPositionController::class, 'getJobPositions'])->name('get-job-positions');

// Route::middleware(['auth'])->group(function () {

//     Route::post('/material/validate-title/{id}', [App\Http\Controllers\Validation\InputTitleController::class, 'inputMaterial'])
//         ->where('id', '[0-9]+');


//     Route::get('/get-subjects', [App\Http\Controllers\OpenController::class, 'getSubjects'])->name('open.subjects');
//     Route::get('/get-subject-headings/{subjectId}', [App\Http\Controllers\OpenController::class, 'getSubjectHeadingsWithParams'])->name('open.subject-headings-with-params');
//     Route::get('/get-subject-headings', [App\Http\Controllers\OpenController::class, 'getSubjectHeadings'])->name('open.subject-headings');

// });


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
Route::get('/out', function (Request $request) {
    Auth::guard('web')->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');

})->name('out');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
