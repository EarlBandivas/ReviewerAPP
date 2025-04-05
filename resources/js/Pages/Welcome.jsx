import Navbar from '@/Components/Navbar';
import { Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
  return (
    <>
      <Head title="Welcome" />
      <div className="bg-base-100 min-h-screen">
        <Navbar auth={auth} />

        <div className="hero bg-base-200 min-h-[calc(100vh-4rem)]">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Review Platform</h1>
              <p className="py-6">
                Welcome to the most comprehensive review platform. Share your
                thoughts, read reviews, and make informed decisions.
              </p>
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
