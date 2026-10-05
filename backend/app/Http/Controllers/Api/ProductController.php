<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $products = Product::query()
            ->with('producer:id,workshop_name,community,municipality,rating')
            ->where('status', 'published')
            ->when($request->string('search')->isNotEmpty(), function (Builder $query) use ($request): void {
                $search = '%'.$request->string('search')->toString().'%';
                $query->where(function (Builder $nested) use ($search): void {
                    $nested->where('name', 'like', $search)
                        ->orWhere('description', 'like', $search)
                        ->orWhere('technique', 'like', $search);
                });
            })
            ->when($request->filled('category'), fn (Builder $query) => $query->where('category', $request->string('category')))
            ->latest()
            ->paginate(min($request->integer('per_page', 18), 50));

        return response()->json($products);
    }

    public function show(Product $product): JsonResponse
    {
        abort_unless($product->status === 'published', 404);

        return response()->json([
            'data' => $product->load(['producer', 'culturalRecord']),
        ]);
    }
}
