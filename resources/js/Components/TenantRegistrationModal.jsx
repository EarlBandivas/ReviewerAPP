import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

export default function TenantRegistrationModal({
  show,
  onClose,
  selectedTier,
}) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data, setData, reset, errors, setError, clearErrors } = useForm({
    company_name: '',
    subdomain: '',
    address: '',
    phone: '',
    contact_name: '',
    contact_email: '',
    plan_name: selectedTier?.tier || '',
    price: selectedTier?.price || 0,
  });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    clearErrors();

    try {
      const response = await axios.post(route('tenant.register'), data);
      if (response.data.success) {
        reset();
        setShowSuccessModal(true);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        Object.keys(error.response.data.errors).forEach((key) => {
          setError(key, error.response.data.errors[key]);
        });
      } else {
        setError(
          'error',
          error.response?.data?.message ||
            'An error occurred during registration.',
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  return (
    <>
      <Modal show={show} onClose={onClose} maxWidth="md">
        <form onSubmit={submit} className="p-6">
          <h2 className="text-lg font-medium text-gray-900">
            Register your Business
          </h2>

          {errors.error && (
            <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
              {errors.error}
            </div>
          )}

          <div className="mt-6">
            <InputLabel htmlFor="company_name" value="Company Name" />
            <TextInput
              id="company_name"
              type="text"
              name="company_name"
              value={data.company_name}
              className="mt-1 block w-full text-black"
              onChange={(e) => setData('company_name', e.target.value)}
              required
            />
            <InputError message={errors.company_name} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="subdomain" value="Subdomain" />
            <TextInput
              id="subdomain"
              type="text"
              name="subdomain"
              value={data.subdomain}
              className="mt-1 block w-full text-black"
              onChange={(e) => setData('subdomain', e.target.value)}
              required
            />
            <InputError message={errors.subdomain} className="mt-2" />
            <span className="mt-1 text-sm text-gray-500">
              Your site will be available at: {data.subdomain}.
              {window.location.hostname.includes('127.0.0.1')
                ? 'localhost:8080'
                : window.location.hostname}
            </span>
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="address" value="Business Address" />
            <TextInput
              id="address"
              type="text"
              name="address"
              value={data.address}
              className="mt-1 block w-full text-black"
              onChange={(e) => setData('address', e.target.value)}
              required
            />
            <InputError message={errors.address} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="phone" value="Phone Number" />
            <TextInput
              id="phone"
              type="tel"
              name="phone"
              value={data.phone}
              className="mt-1 block w-full text-black"
              onChange={(e) => setData('phone', e.target.value)}
              required
            />
            <InputError message={errors.phone} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="contact_name" value="Contact Person Name" />
            <TextInput
              id="contact_name"
              type="text"
              name="contact_name"
              value={data.contact_name}
              className="mt-1 block w-full text-black"
              onChange={(e) => setData('contact_name', e.target.value)}
              required
            />
            <InputError message={errors.contact_name} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="contact_email" value="Contact Email" />
            <TextInput
              id="contact_email"
              type="email"
              name="contact_email"
              value={data.contact_email}
              className="mt-1 block w-full text-black"
              onChange={(e) => setData('contact_email', e.target.value)}
              required
            />
            <InputError message={errors.contact_email} className="mt-2" />
          </div>

          <div className="mt-6 flex justify-end">
            <PrimaryButton disabled={submitting}>
              {submitting ? 'Registering...' : 'Register'}
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <Modal
        show={showSuccessModal}
        onClose={handleSuccessModalClose}
        maxWidth="md"
      >
        <div className="p-6">
          <div className="mb-6 text-center">
            <div className="mb-4 text-5xl text-green-500">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900">
              Congratulations!
            </h2>
            <p className="mt-2 text-gray-600">
              Your registration has been submitted successfully. We'll review
              your application and send you an email with:
            </p>
            <ul className="mt-4 list-inside list-disc text-left text-gray-600">
              <li>Your application status</li>
              <li>Login credentials</li>
              <li>Link to your web application</li>
              <li>Thank you for choosing us!</li>
            </ul>
          </div>
          <div className="mt-6 flex justify-center">
            <PrimaryButton onClick={handleSuccessModalClose}>
              Got it!
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </>
  );
}
