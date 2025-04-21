import { useState } from 'react';
import axios from 'axios';

export default function EditSubscriptionModal({ show, onClose, tenant, onSuccess }) {
    const [formData, setFormData] = useState({
        plan_name: tenant?.subscription?.plan_name || '',
        price: tenant?.subscription?.price || ''
    });
    const [loading, setLoading] = useState(false);

    const plans = [
        { name: 'Basic', defaultPrice: '9' },
        { name: 'Premium', defaultPrice: '29' },
        { name: 'Enterprise', defaultPrice: '99' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(route('tenant.update-subscription'), {
                tenant_id: tenant.id,
                ...formData
            });

            if (response.data.success) {
                onSuccess(response.data.message);
                onClose();
            }
        } catch (error) {
            console.error('Failed to update subscription:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <div className="inline-block transform overflow-hidden rounded-lg bg-base-100 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                    <form onSubmit={handleSubmit} className="p-6">
                        <h3 className="mb-4 text-lg font-medium">Edit Subscription</h3>
                        
                        <div className="mb-4">
                            <label className="mb-2 block">Plan</label>
                            <select
                                className="select select-bordered w-full"
                                value={formData.plan_name}
                                onChange={(e) => {
                                    const plan = plans.find(p => p.name === e.target.value);
                                    setFormData({
                                        plan_name: e.target.value,
                                        price: plan.defaultPrice
                                    });
                                }}
                            >
                                {plans.map(plan => (
                                    <option key={plan.name} value={plan.name}>
                                        {plan.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="mb-2 block">Price</label>
                            <input
                                type="number"
                                className="input input-bordered w-full"
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    price: e.target.value
                                }))}
                            />
                        </div>

                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}