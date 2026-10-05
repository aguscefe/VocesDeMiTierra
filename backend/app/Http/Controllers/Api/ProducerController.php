<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProducerProfile;
use Illuminate\Http\JsonResponse;

class ProducerController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => ProducerProfile::query()
                ->where('authorization_status', 'approved')
                ->withCount(['products' => fn ($query) => $query->where('status', 'published')])
                ->orderByDesc('rating')
                ->get(),
        ]);
    }

    public function show(ProducerProfile $producer): JsonResponse
    {
        abort_unless($producer->authorization_status === 'approved', 404);

        return response()->json([
            'data' => $producer->load([
                'products' => fn ($query) => $query->where('status', 'published'),
            ]),
        ]);
    }
}
