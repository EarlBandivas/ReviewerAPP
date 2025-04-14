import TenantViewModal from '@/Components/TenantViewModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

export default function Dashboard({ tenants }) {
  const [loading, setLoading] = useState({});
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const handleAction = async (tenantId, action) => {
    setLoading((prev) => ({ ...prev, [tenantId]: true }));
    try {
      const response = await axios.post(route('tenant.action'), {
        tenant_id: tenantId,
        action: action,
      });

      if (response.data.success) {
        // Show success message
        alert(response.data.message);
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Action failed:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to process the action. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, [tenantId]: false }));
    }
  };

  // Simplified handleViewTenant - directly use the tenant data we already have
  const handleViewTenant = (tenant) => {
    setSelectedTenant(tenant);
    setShowViewModal(true);
  };

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      <div className="mx-auto max-w-7xl text-black sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Tenant Applications</h2>
            <div className="border-base-content/5 overflow-x-auto rounded-box border">
              <table className="table table-zebra w-full">
                <thead className="text-black">
                  <tr>
                    <th>Company Name</th>
                    <th>Contact Person</th>
                    <th>Email</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants?.map((tenant) => (
                    <tr key={tenant.id}>
                      <td>{tenant.company_name}</td>
                      <td>{tenant.contact_name}</td>
                      <td>{tenant.contact_email}</td>
                      <td>
                        <span className="badge badge-primary">
                          {tenant.subscription?.plan_name}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            tenant.status === 'pending'
                              ? 'badge-warning'
                              : tenant.status === 'approved'
                                ? 'badge-success'
                                : 'badge-error'
                          }`}
                        >
                          {tenant.status}
                        </span>
                      </td>
                      <td className="space-x-2">
                        {tenant.status === 'pending' && (
                          <>
                            <button
                              className="btn btn-success btn-sm text-black"
                              onClick={() => handleAction(tenant.id, 'approve')}
                              disabled={loading[tenant.id]}
                            >
                              {loading[tenant.id] ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                              className="btn btn-error btn-sm text-black"
                              onClick={() => handleAction(tenant.id, 'reject')}
                              disabled={loading[tenant.id]}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => handleViewTenant(tenant)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <TenantViewModal
        show={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedTenant(null);
        }}
        tenant={selectedTenant}
      />
    </AuthenticatedLayout>
  );
}
