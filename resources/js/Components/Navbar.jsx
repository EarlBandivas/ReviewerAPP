import Login from '@/Pages/Auth/Login';
import Register from '@/Pages/Auth/Register';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Navbar({ auth }) {
  const [theme, setTheme] = useState('light');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
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
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
        </div>
        <Link href="/" className="btn btn-ghost text-xl normal-case">
          ReviewerApp
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex"></div>
      <div className="navbar-end">
        <label className="swap swap-rotate mr-4">
          <input
            type="checkbox"
            onChange={toggleTheme}
            checked={theme === 'dark'}
          />
          <svg
            className="swap-on h-6 w-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
        {auth?.user ? (
          <Link href={route('dashboard')} className="btn btn-primary">
            Dashboard
          </Link>
        ) : (
          <>
            <button
              onClick={() => setShowLoginModal(true)}
              className="btn btn-ghost"
            >
              Log in
            </button>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="btn btn-primary ml-2"
            >
              Register
            </button>
          </>
        )}
      </div>
      <Login
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        canResetPassword={true}
      />
      <Register
        show={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </div>
  );
}
