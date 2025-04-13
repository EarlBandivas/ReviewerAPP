import Modal from '@/Components/Modal';

export default function TenantViewModal({ show, onClose, tenant }) {
  if (!tenant) return null;

  return (
    <Modal show={show} onClose={onClose} maxWidth="2xl">
      <div className="p-6 text-black">
        <h2 className="mb-4 text-xl font-semibold">Tenant Information</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Company Details</h3>
              <p>
                <strong>Company Name:</strong> {tenant.company_name}
              </p>
              <p>
                <strong>Address:</strong> {tenant.address}
              </p>
              <p>
                <strong>Phone:</strong> {tenant.phone}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Contact Information</h3>
              <p>
                <strong>Contact Person:</strong> {tenant.contact_name}
              </p>
              <p>
                <strong>Email:</strong> {tenant.contact_email}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Subscription Details</h3>
              <p>
                <strong>Plan:</strong> {tenant.subscription?.plan_name}
              </p>
              <p>
                <strong>Price:</strong> ${tenant.subscription?.price}
              </p>
              <p>
                <strong>Status:</strong>{' '}
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
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Domain Information</h3>
              <p>
                <strong>Subdomain:</strong> {tenant.id}
              </p>
              <p>
                <strong>Full URL:</strong>{' '}
                {`${window.location.protocol}//${tenant.id}.${window.location.host}`}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
