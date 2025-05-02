import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
  const { auth } = usePage().props;
  const user = auth?.user; // Add optional chaining
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Redirect or show error if no user
  if (!user) {
    return <div>Not authenticated</div>; // Or redirect to login
  }

  // Check if routes exist using Ziggy's Route.has() method
  const hasProfileRoute = route().has('profile.edit');
  const hasLogoutRoute = route().has('logout');

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-none lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="btn btn-ghost btn-square"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-6 w-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
        <div className="flex-1">
          <h1 className="ms-6 text-xl">ReviewerApp</h1>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name,
                  )}`}
                  alt={user.name}
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              {hasProfileRoute && (
                <li>
                  <Link
                    href={route('profile.edit')}
                    className="justify-between"
                  >
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
              )}
              {hasLogoutRoute && (
                <li>
                  <Link href={route('logout')} method="post" as="button">
                    Logout
                  </Link>
                </li>
              )}
              {!hasProfileRoute && !hasLogoutRoute && (
                <li>
                  <a href="/logout">Logout</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 z-50 mt-1 w-64 transform bg-base-100 transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:static lg:translate-x-0`}
        >
          <div className="flex h-full justify-center p-4">
            <ul className="menu w-full text-base-content">
              <li className="mb-2 font-semibold">
                <Link href={route('dashboard')}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li className="mb-2 font-semibold">
                <Link href={route('analytics')}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Analytics
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          {header && (
            <header className="bg-base-100 shadow-sm">
              <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {header}
              </div>
            </header>
          )}

          {/* Page Content */}
          <main className="p-4">{children}</main>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
      </div>
    </div>
  );
}
