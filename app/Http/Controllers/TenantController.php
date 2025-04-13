<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\TenantSubscription;
use App\Notifications\TenantAdminCredentials;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\TenantRegistrationPending;
use Illuminate\Validation\Rule;
use Stancl\Tenancy\Database\Models\Domain;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Mail\TenantApproved;
use App\Mail\TenantRejected;
class TenantController extends Controller
{
    public function index()
    {
        $tenants = Tenant::with('subscription')->orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Dashboard', [
            'tenants' => $tenants
        ]);
    }

    public function register(Request $request)
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'subdomain' => [
                    'required',
                    'string',
                    'min:3',
                    'max:50',
                    'alpha_dash',
                    Rule::unique('tenants', 'id'),
                ],
                'company_name' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'contact_name' => 'required|string|max:255',
                'contact_email' => 'required|email|max:255',
                'plan_name' => 'required|string',
                'price' => 'required|numeric|min:0',
            ]);

            DB::beginTransaction();
            
            $subdomain = strtolower(trim($validated['subdomain']));
            $fullDomain = $subdomain . '.' . config('app.domain');

            // Check if domain exists
            $existingDomain = Domain::where('domain', $fullDomain)->first();
            if ($existingDomain) {
                return response()->json([
                    'success' => false,
                    'errors' => [
                        'subdomain' => ['This subdomain is already taken.']
                    ]
                ], 422);
            }

            // Check if tenant exists with this id (subdomain)
            $existingTenant = Tenant::find($subdomain);
            if ($existingTenant) {
                return response()->json([
                    'success' => false,
                    'errors' => [
                        'subdomain' => ['This subdomain is already taken.']
                    ]
                ], 422);
            }

            // Generate a temporary password
            $temporaryPassword = Str::random(12);

            // Create tenant
            $tenant = new Tenant();
            $tenant->id = $subdomain;
            $tenant->company_name = $validated['company_name'];
            $tenant->address = $validated['address'];
            $tenant->phone = $validated['phone'];
            $tenant->contact_name = $validated['contact_name'];
            $tenant->contact_email = $validated['contact_email'];
            $tenant->status = 'pending';
            $tenant->temporary_password = bcrypt($temporaryPassword);
            
            if (!$tenant->save()) {
                throw new \Exception('Failed to create tenant record');
            }

            // Create domain
            $domain = Domain::create([
                'domain' => $fullDomain,
                'tenant_id' => $tenant->id
            ]);

            if (!$domain) {
                throw new \Exception('Failed to create domain record');
            }

            // Create subscription
            $subscription = new TenantSubscription([
                'tenant_id' => $tenant->id,
                'plan_name' => $validated['plan_name'],
                'price' => $validated['price'],
                'starts_at' => now(),
                'ends_at' => now()->addMonth(), // Default to 1 month subscription
            ]);

            if (!$subscription->save()) {
                throw new \Exception('Failed to create subscription record');
            }

            // Send email notification
            Mail::to($validated['contact_email'])->send(new TenantRegistrationPending([
                'companyName' => $validated['company_name'],
                'contactName' => $validated['contact_name'],
                'contact_email' => $validated['contact_email'],
                'subdomain' => $subdomain,
                'temporaryPassword' => $temporaryPassword,
            ]));

            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Tenant registered successfully!'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Tenant registration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            
            if ($e instanceof \Illuminate\Database\QueryException && $e->errorInfo[1] == 1062) {
                return response()->json([
                    'success' => false,
                    'errors' => [
                        'subdomain' => ['This subdomain is already taken.']
                    ]
                ], 422);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to register tenant: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function action(Request $request)
    {
        $validated = $request->validate([
            'tenant_id' => 'required|string|exists:tenants,id',
            'action' => 'required|string|in:approve,reject'
        ]);

        $tenant = Tenant::findOrFail($validated['tenant_id']);

        if ($validated['action'] === 'approve') {
            // Generate a new password
            $password = Str::random(12);
            $tenant->temporary_password = bcrypt($password);
            $tenant->status = 'approved';
            
            // Send approval email with credentials
            Mail::to($tenant->contact_email)->send(new TenantApproved([
                'companyName' => $tenant->company_name,
                'contactName' => $tenant->contact_name,
                'subdomain' => $tenant->id,
                'password' => $password,
                'loginUrl' => config('app.protocol', 'https') . '://' . $tenant->id . '.' . config('app.domain'),
            ]));

            $tenant->save();
        } else {
            // Send rejection email before deleting
            Mail::to($tenant->contact_email)->send(new TenantRejected([
                'companyName' => $tenant->company_name,
                'contactName' => $tenant->contact_name,
            ]));

            // Delete the tenant and related data
            $tenant->subscription()->delete();
            $tenant->domains()->delete();
            $tenant->delete();
        }

        return response()->json(['success' => true]);
    }

    public function view($id)
    {
        $tenant = Tenant::with('subscription')->findOrFail($id);
        
        return response()->json([
            'tenant' => $tenant
        ]);
    }
}






















