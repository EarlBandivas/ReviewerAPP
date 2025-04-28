import Navbar from '@/Components/Navbar';
import TenantRegistrationModal from '@/Components/TenantRegistrationModal';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

const PricingCard = ({ tier, price, popular, features }) => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  return (
    <div
      className={`card w-96 ${popular ? 'scale-105 bg-primary text-primary-content' : 'bg-base-100'} shadow-xl transition-all hover:scale-105 ${!popular && 'hover:bg-base-200'}`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="badge badge-secondary">Most Popular</div>
        </div>
      )}
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">{tier}</h2>
          <div className="text-right">
            <span className="text-3xl font-bold">${price}</span>
            <span className="text-sm opacity-80">/mo</span>
          </div>
        </div>
        <ul className="mt-6 flex flex-col gap-3 text-sm">
          {features.map((feature, index) => (
            <li
              key={index}
              className={`flex items-center gap-2 ${feature.disabled ? 'opacity-50' : ''}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`size-5 ${feature.disabled ? 'text-base-content/50' : popular ? 'text-primary-content' : 'text-success'}`}
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
        <div className="mt-8">
          <button
            className={`btn ${popular ? 'btn-secondary' : 'btn-primary'} btn-block`}
            onClick={() => setShowRegistrationModal(true)}
          >
            Get Started
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

        {/* Hero Section with gradient and pattern */}
        <div className="relative overflow-hidden bg-base-200">
          <div className="from-primary/20 to-secondary/20 absolute inset-0 bg-gradient-to-br"></div>
          <div className="hero py-24">
            <div className="hero-content max-w-3xl text-center">
              <div className="space-y-8">
                <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-6xl font-bold text-transparent">
                  Review Platform
                </h1>
                <p className="text-xl opacity-90">
                  Welcome to the most comprehensive review platform. Share your
                  thoughts, read reviews, and make informed decisions with
                  confidence.
                </p>
                <div className="flex justify-center gap-4">
                  <button className="btn btn-primary btn-lg">
                    Get Started
                  </button>
                  <button className="btn btn-ghost btn-lg">Learn More</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-base-100 py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-16 text-center text-3xl font-bold">
              Why Choose Us?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: 'Easy Integration',
                  description:
                    'Set up your review system in minutes with our simple integration process',
                  icon: '🚀',
                },
                {
                  title: 'Powerful Analytics',
                  description:
                    'Gain valuable insights from customer feedback with advanced analytics',
                  icon: '📊',
                },
                {
                  title: 'Secure Platform',
                  description:
                    'Your data is protected with enterprise-grade security measures',
                  icon: '🔒',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="card bg-base-200 transition-colors hover:bg-base-300"
                >
                  <div className="card-body items-center text-center">
                    <div className="mb-4 text-4xl">{feature.icon}</div>
                    <h3 className="card-title">{feature.title}</h3>
                    <p className="opacity-80">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-base-200 py-24">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold">Choose Your Plan</h2>
              <p className="text-lg opacity-80">
                Start with a plan that works best for you
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {pricingTiers.map((tier, index) => (
                <PricingCard key={index} {...tier} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-base-100 py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-6 text-4xl font-bold">Ready to Get Started?</h2>
              <p className="mb-8 text-lg opacity-80">
                Join thousands of businesses who trust our platform for their
                review management needs.
              </p>
              <button className="btn btn-primary btn-lg">
                Start Your Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
