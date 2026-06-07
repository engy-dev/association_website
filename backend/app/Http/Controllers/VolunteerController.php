<?php
namespace App\Http\Controllers;

use App\Models\VolunteerJob;
use App\Models\VolunteerApplication;
use Illuminate\Http\Request;

class VolunteerController extends Controller
{
    /**
     * GET /api/volunteers
     * Returns jobs where expires_at > NOW()
     */
    public function index(Request $request)
    {
        $lang = $this->getLocale(); // 'en', 'fr', or 'ar'

        $jobs = VolunteerJob::query()
            ->where('expires_at', '>', now())
            ->orderBy('expires_at')
            ->get()
            ->map(fn($job) => [
                'id'          => $job->id,
                'title'       => $job->{"title_{$lang}"},
                'description' => $job->{"description_{$lang}"},
                'location'    => $job->location,
                'expires_at'  => $job->expires_at,
                'questions'   => $job->questions ?? [],
            ]);

        return response()->json($jobs);
    }

    /**
     * POST /api/volunteers/{job}/apply
     */
    public function apply(Request $request, VolunteerJob $job)
    {
        $request->validate([
            'applicant_name'  => 'required|string|max:255',
            'applicant_email' => 'required|email|max:255',
            'answers'         => 'required|array',
        ]);

        $application = VolunteerApplication::create([
            'job_id'          => $job->id,
            'applicant_name'  => $request->applicant_name,
            'applicant_email' => $request->applicant_email,
            'answers'         => $request->answers,
        ]);

        return response()->json(['success' => true, 'id' => $application->id], 201);
    }
}