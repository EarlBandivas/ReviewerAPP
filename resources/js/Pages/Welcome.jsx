import Navbar from '@/Components/Navbar';
import TenantRegistrationModal from '@/Components/TenantRegistrationModal';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

const PricingCard = ({ tier, price, popular, features }) => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  return (
    <div className="card w-96 bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">{tier}</h2>
          <span className="text-xl">${price}/mo</span>
        </div>
        <ul className="mt-6 flex flex-col gap-2 text-xs">
          {features.map((feature, index) => (
            <li key={index} className={feature.disabled ? 'opacity-50' : ''}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`me-2 inline-block size-4 ${
                  feature.disabled ? 'text-base-content/50' : 'text-success'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className={feature.disabled ? 'line-through' : ''}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <button
            className="btn btn-primary btn-block"
            onClick={() => setShowRegistrationModal(true)}
          >
            Subscribe
          </button>
        </div>
      </div>
      <TenantRegistrationModal
        show={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        selectedTier={{ tier, price }}
      />
    </div>
  );
};

export default function Welcome() {
  const { auth } = usePage().props;

  const pricingTiers = [
    {
      tier: 'Basic',
      price: '9',
      popular: false,
      features: [
        { text: '1 Month subscription', disabled: false },
        { text: '3 Months subscription', disabled: true },
        { text: '6 Months subscription', disabled: true },
        { text: '12 Months subscription', disabled: true },
        { text: '1 Admin user', disabled: false },
        { text: '3 Admin users', disabled: true },
        { text: 'Unlimited admins', disabled: true },
      ],
    },
    {
      tier: 'Premium',
      price: '29',
      popular: true,
      features: [
        { text: '1 Month subscription', disabled: false },
        { text: '3 Months subscription', disabled: false },
        { text: '6 Months subscription', disabled: false },
        { text: '12 Months subscription', disabled: true },
        { text: '1 Admin user', disabled: false },
        { text: '3 Admin users', disabled: false },
        { text: 'Unlimited admins', disabled: true },
      ],
    },
    {
      tier: 'Enterprise',
      price: '99',
      popular: false,
      features: [
        { text: '1 Month subscription', disabled: false },
        { text: '3 Months subscription', disabled: false },
        { text: '6 Months subscription', disabled: false },
        { text: '12 Months subscription', disabled: false },
        { text: '1 Admin user', disabled: false },
        { text: '3 Admin users', disabled: false },
        { text: 'Unlimited admins', disabled: false },
      ],
    },
  ];

  return (
    <>
      <Head title="Welcome" />
      <div className="min-h-screen bg-base-100">
        <Navbar auth={auth} />

        <div className="hero bg-base-200 py-12">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Review Platform</h1>
              <p className="py-6">
                Welcome to the most comprehensive review platform. Share your
                thoughts, read reviews, and make informed decisions.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-12">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Choose Your Plan
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {pricingTiers.map((tier, index) => (
              <PricingCard key={index} {...tier} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
