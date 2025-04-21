import TenantLayout from '@/Layouts/TenantLayout';
import { Head } from '@inertiajs/react';

export default function Home({ tenant, latestReviews, featuredProducts }) {
  return (
    <TenantLayout>
      <Head title="Home" />

      {/* Hero Section */}
      <div className="hero min-h-[500px] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">{tenant.company_name}</h1>
            <p className="py-6">
              Welcome to our review platform. Share your experiences and
              discover what others are saying.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>

      {/* Latest Reviews Section */}
      <section className="py-12">
        <h2 className="mb-8 text-center text-3xl font-bold">Latest Reviews</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {latestReviews?.map((review) => (
            <div key={review.id} className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title">{review.title}</h3>
                <p>{review.content}</p>
                <div className="card-actions justify-end">
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <input
                        key={i}
                        type="radio"
                        name={`rating-${review.id}`}
                        className="mask mask-star-2 bg-orange-400"
                        checked={i + 1 === review.rating}
                        readOnly
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12">
        <h2 className="mb-8 text-center text-3xl font-bold">
          Featured Products
        </h2>
        <div className="grid gap-6 md:grid-cols-4">
          {featuredProducts?.map((product) => (
            <div key={product.id} className="card bg-base-200">
              <figure>
                <img src={product.image} alt={product.name} />
              </figure>
              <div className="card-body">
                <h3 className="card-title">{product.name}</h3>
                <p>{product.description}</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </TenantLayout>
  );
}
