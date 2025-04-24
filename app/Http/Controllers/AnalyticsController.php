<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\TenantSubscription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function index()
    {
        // Get subscription counts by plan
        $subscriptionsByPlan = TenantSubscription::select('plan_name', DB::raw('count(*) as total'))
            ->groupBy('plan_name')
            ->get();

        // Get monthly subscription growth
        $monthlyGrowth = TenantSubscription::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('count(*) as total')
        )
            ->groupBy('month')
            ->orderBy('month')
            ->limit(6)
            ->get();

        // Get status distribution
        $tenantStatus = Tenant::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get();

        // Calculate total revenue
        $totalRevenue = TenantSubscription::sum('price');
        $activeSubscriptions = TenantSubscription::count();
        $totalTenants = Tenant::count();

        return Inertia::render('Analytics', [
            'subscriptionsByPlan' => $subscriptionsByPlan,
            'monthlyGrowth' => $monthlyGrowth,
            'tenantStatus' => $tenantStatus,
            'stats' => [
                'totalRevenue' => $totalRevenue,
                'activeSubscriptions' => $activeSubscriptions,
                'totalTenants' => $totalTenants,
            ]
        ]);
    }
}