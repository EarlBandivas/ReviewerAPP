<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\TenantSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\TenantRegistrationPending;
use Illuminate\Validation\Rule;
use Stancl\Tenancy\Database\Models\Domain;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Mail\TenantApproved;
use App\Mail\TenantRejected;
use Illuminate\Support\Facades\Artisan;

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
        try {
            $validated = $request->validate([
                'tenant_id' => 'required|string|exists:tenants,id',
                'action' => 'required|string|in:approve,reject'
            ]);
            
            $tenant = Tenant::findOrFail($validated['tenant_id']);
            
            if ($validated['action'] === 'approve') {
                $password = Str::random(12);
                $tenant->temporary_password = bcrypt($password);
                $tenant->status = 'approved';
                
                if (!$tenant->save()) {
                    throw new \Exception('Failed to update tenant status');
                }

                // Create the tenant database
                $databaseName = 'tenant_' . $tenant->id;
                DB::statement("DROP DATABASE IF EXISTS `$databaseName`");
                DB::statement("CREATE DATABASE `$databaseName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

                // Configure the tenant connection
                config([
                    'database.connections.tenant.database' => $databaseName
                ]);

                // Initialize tenancy
                tenancy()->initialize($tenant);

                try {
                    // Run migrations
                    Artisan::call('migrate', [
                        '--force' => true,
                        '--path' => 'database/migrations/tenant',
                        '--database' => 'tenant'
                    ]);

                    // Create admin user in tenant database
                    DB::connection('tenant')->table('users')->insert([
                        'name' => $tenant->contact_name,
                        'email' => $tenant->contact_email,
                        'password' => bcrypt($password),
                        'email_verified_at' => now(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                } finally {
                    tenancy()->end();
                }

                Log::info('Sending approval email to tenant', [
                    'email' => $tenant->contact_email,
                    'company' => $tenant->company_name
                ]);

                // Add more detailed logging
                Log::info('Preparing to send approval email', [
                    'tenant_email' => $tenant->contact_email,
                    'tenant_name' => $tenant->contact_name,
                    'company' => $tenant->company_name
                ]);

                try {
                    Mail::to($tenant->contact_email)->send(new TenantApproved([
                        'companyName' => $tenant->company_name,
                        'contactName' => $tenant->contact_name,
                        'contact_email' => $tenant->contact_email,
                        'subdomain' => $tenant->id,
                        'password' => $password,
                        'loginUrl' => 'https://' . $tenant->id . '.' . config('app.domain'),
                    ]));

                    Log::info('Approval email sent successfully', [
                        'tenant_email' => $tenant->contact_email
                    ]);
                } catch (\Exception $e) {
                    Log::error('Failed to send approval email', [
                        'error' => $e->getMessage(),
                        'tenant_email' => $tenant->contact_email
                    ]);
                    throw $e;
                }

            } else {
                try {
                    Log::info('Sending rejection email', ['tenant_id' => $tenant->id]);
                    Mail::to($tenant->contact_email)->send(new TenantRejected([
                        'companyName' => $tenant->company_name,
                        'contactName' => $tenant->contact_name,
                    ]));

                    Log::info('Deleting tenant data', ['tenant_id' => $tenant->id]);
                    // Delete all related data
                    $tenant->domains()->delete();
                    if ($tenant->subscription) {
                        $tenant->subscription()->delete();
                    }
                    $tenant->delete();

                } catch (\Exception $e) {
                    Log::error('Failed during tenant rejection process', [
                        'tenant_id' => $tenant->id,
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                    throw $e;
                }
            }
            
            return response()->json([
                'success' => true,
                'message' => $validated['action'] === 'approve' 
                    ? 'Tenant approved successfully' 
                    : 'Tenant rejected successfully'
            ]);

        } catch (\Exception $e) {
            tenancy()->end();
            
            Log::error('Tenant action failed', [
                'action' => $request->input('action'),
                'tenant_id' => $request->input('tenant_id'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process tenant: ' . $e->getMessage()
            ], 500);
        }
    }

    public function view($id)
    {
        $tenant = Tenant::with('subscription')->findOrFail($id);
        
        return response()->json([
            'tenant' => $tenant
        ]);
    }

    public function updateSubscription(Request $request)
    {
        try {
            $validated = $request->validate([
                'tenant_id' => 'required|string|exists:tenants,id',
                'plan_name' => 'required|string',
                'price' => 'required|numeric|min:0',
            ]);

            $tenant = Tenant::findOrFail($validated['tenant_id']);
            
            if (!$tenant->subscription) {
                return response()->json([
                    'success' => false,
                    'message' => 'No subscription found for this tenant'
                ], 404);
            }

            $tenant->subscription->update([
                'plan_name' => $validated['plan_name'],
                'price' => $validated['price'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Subscription updated successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Subscription update failed', [
                'tenant_id' => $request->input('tenant_id'),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update subscription: ' . $e->getMessage()
            ], 500);
        }
    }

    public function toggleStatus(Request $request)
    {
        try {
            $validated = $request->validate([
                'tenant_id' => 'required|string|exists:tenants,id',
                'is_disabled' => 'required|boolean'
            ]);

            $tenant = Tenant::findOrFail($validated['tenant_id']);
            $tenant->is_disabled = $validated['is_disabled'];
            $tenant->save();

            return response()->json([
                'success' => true,
                'message' => $tenant->is_disabled ? 'Tenant disabled successfully' : 'Tenant enabled successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Tenant status toggle failed', [
                'tenant_id' => $request->input('tenant_id'),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update tenant status: ' . $e->getMessage()
            ], 500);
        }
    }
}


















































