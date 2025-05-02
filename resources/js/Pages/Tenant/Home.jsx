import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const SubscriptionCard = () => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mb-4 text-2xl">Subscription Plans</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Plan */}
          <div className="rounded-lg border bg-base-200 p-4 transition-all hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Basic</h3>
              <span className="badge badge-primary">$9/mo</span>
            </div>
            <ul className="mb-6 space-y-2">
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5 text-success"
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
                Basic study materials
              </li>

              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5 text-success"
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
                1 assignment review per month
              </li>
              <li className="flex items-center opacity-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5 text-error"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Advanced study materials
              </li>
              <li className="flex items-center opacity-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5 text-error"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Video tutorials
              </li>
            </ul>
            <button className="btn btn-primary btn-outline w-full">
              Get Started
            </button>
          </div>

          {/* Premium Plan */}
          <div className="relative rounded-lg border-2 border-primary bg-base-100 p-4 shadow-md">
            <div className="absolute -top-3 right-4">
              <span className="badge badge-secondary">Recommended</span>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Premium</h3>
              <span className="badge badge-primary">$29/mo</span>
            </div>
            <ul className="mb-6 space-y-2">
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5 text-success"
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
                Basic study materials
              </li>

              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5 text-success"
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
                <strong>Unlimited</strong> assignment reviews
              </li>
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5 text-success"
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
                Advanced study materials
              </li>
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5 text-success"
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
                Video tutorials
              </li>
            </ul>
            <button className="btn btn-primary w-full">Upgrade Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home({ tenant, latestReviews, featuredProducts }) {
  const [activeTab, setActiveTab] = useState('assignments');

  // Get tenant from props or from usePage if available
  const { props } = usePage();
  const tenantData = tenant ||
    props.tenant || { company_name: 'Review Center' };

  return (
    <div className="min-h-screen bg-base-200">
      <Head title={`${tenantData.company_name}`} />

      {/* Navigation */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">{tenantData.company_name}</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#materials">Materials</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
            {props.auth?.user ? (
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
            ) : (
              <li>
                <Link href="/login" className="btn btn-primary btn-sm">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero min-h-[500px] bg-base-100">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img
            src="https://placehold.co/600x400/3d4451/ffffff?text=Review+Center"
            className="max-w-sm rounded-lg shadow-2xl"
            alt="Review Center"
          />
          <div>
            <h1 className="text-5xl font-bold">
              Welcome to {tenantData.company_name}
            </h1>
            <p className="py-6">
              Your one-stop platform for submitting assignments, accessing study
              materials, and improving your academic performance.
            </p>
            {/* <div className="flex gap-4">
              <Link href="/assignments/submit" className="btn btn-primary">
                Submit Assignment
              </Link>
              <Link href="/materials" className="btn btn-outline">
                Browse Materials
              </Link>
            </div> */}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="bg-base-200 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Submit Assignments</h3>
                <p>
                  Upload your assignments securely and receive timely feedback
                  from our expert reviewers.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Access Study Materials</h3>
                <p>
                  Browse our extensive library of study guides, practice tests,
                  and reference materials.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Track Your Progress</h3>
                <p>
                  Monitor your performance with detailed analytics and
                  personalized improvement suggestions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="bg-base-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Choose Your Plan
          </h2>
          <div className="flex justify-center">
            <SubscriptionCard />
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section id="materials" className="bg-base-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Explore Our Materials
          </h2>

          <div className="tabs-boxed tabs mb-6 justify-center">
            <a
              className={`tab ${activeTab === 'assignments' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('assignments')}
            >
              Assignments
            </a>
            <a
              className={`tab ${activeTab === 'materials' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('materials')}
            >
              Study Materials
            </a>
            <a
              className={`tab ${activeTab === 'reviews' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </a>
          </div>

          <div className="rounded-box bg-base-200 p-6">
            {activeTab === 'assignments' && (
              <div>
                <h3 className="mb-4 text-xl font-bold">
                  Assignment Submission
                </h3>
                <p className="mb-4">
                  Our streamlined assignment submission system makes it easy to
                  upload your work and get feedback.
                </p>
                <Link href="/assignments/submit" className="btn btn-primary">
                  Submit Now
                </Link>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="grid gap-4 md:grid-cols-3">
                {['Study Guides', 'Practice Tests', 'Video Tutorials'].map(
                  (material, index) => (
                    <div key={index} className="card bg-base-100">
                      <div className="card-body">
                        <h3 className="card-title">{material}</h3>
                        <p>
                          Access quality learning materials to improve your
                          understanding.
                        </p>
                        <div className="card-actions mt-4 justify-end">
                          <Link
                            href={`/materials/${material.toLowerCase().replace(/\s+/g, '-')}`}
                            className="btn btn-primary btn-sm"
                          >
                            Browse
                          </Link>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="mb-4 text-xl font-bold">Student Feedback</h3>
                <p className="mb-4">
                  See what our students have to say about their experience with
                  our review center.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="card bg-base-100">
                      <div className="card-body">
                        <h3 className="card-title">Excellent Resource</h3>
                        <div className="rating rating-sm mb-2">
                          {[...Array(5)].map((_, j) => (
                            <input
                              key={j}
                              type="radio"
                              className="mask mask-star-2 bg-orange-400"
                              checked={j < 5}
                              readOnly
                            />
                          ))}
                        </div>
                        <p>
                          The materials provided were extremely helpful for my
                          exam preparation.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="bg-primary py-12 text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mb-6">
            Join thousands of students who have enhanced their learning
            experience with our review center.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register" className="btn btn-secondary">
              Create Account
            </Link>
            <Link href="/about" className="btn bg-base-100 text-primary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-neutral p-10 text-neutral-content">
        <div>
          <span className="footer-title">Services</span>
          <a className="link link-hover">Assignment Review</a>
          <a className="link link-hover">Study Materials</a>
          <a className="link link-hover">Tutoring</a>
          <a className="link link-hover">Progress Tracking</a>
        </div>
        <div>
          <span className="footer-title">Company</span>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">FAQ</a>
        </div>
        <div>
          <span className="footer-title">Legal</span>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </div>
      </footer>
    </div>
  );
}
