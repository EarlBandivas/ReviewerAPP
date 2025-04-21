<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $tenant = tenant();
        $latestReviews = Review::latest()->take(3)->get();
        $featuredProducts = Product::where('is_featured', true)->take(4)->get();

        return Inertia::render('Tenant/Home', [
            'tenant' => $tenant,
            'latestReviews' => $latestReviews,
            'featuredProducts' => $featuredProducts,
        ]);
    }

    public function about()
    {
        return Inertia::render('Tenant/About', [
            'tenant' => tenant(),
        ]);
    }

    public function dashboard()
    {
        return Inertia::render('Tenant/Dashboard', [
            'tenant' => tenant(),
            'stats' => [
                'total_reviews' => Review::count(),
                'total_products' => Product::count(),
                'average_rating' => Review::avg('rating'),
            ],
        ]);
    }

    public function privacy()
    {
        return Inertia::render('Tenant/Privacy', [
            'tenant' => tenant(),
        ]);
    }

    public function terms()
    {
        return Inertia::render('Tenant/Terms', [
            'tenant' => tenant(),
        ]);
    }
}