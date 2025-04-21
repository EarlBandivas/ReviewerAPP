import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function TenantLayout({ children }) {
    const { tenant, auth } = usePage().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-base-100">
            {/* Header */}
            <header className="bg-primary text-primary-content">
                <div className="container mx-auto px-4">
                    <div className="navbar">
                        <div className="flex-1">
                            <Link href="/" className="text-xl font-bold">
                                {tenant.company_name}
                            </Link>
                        </div>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden flex-none md:block">
                            <ul className="menu menu-horizontal px-1">
                                <li><Link href="/reviews">Reviews</Link></li>
                                <li><Link href="/products">Products</Link></li>
                                <li><Link href="/about">About Us</Link></li>
                                <li><Link href="/contact">Contact</Link></li>
                                {auth.user ? (
                                    <>
                                        <li><Link href="/dashboard">Dashboard</Link></li>
                                        <li>
                                            <Link href={route('logout')} method="post" as="button">
                                                Logout
                                            </Link>
                                        </li>
                                    </>
                                ) : (
                                    <li><Link href="/login">Login</Link></li>
                                )}
                            </ul>
                        </div>

                        {/* Mobile Navigation */}
                        <div className="flex-none md:hidden">
                            <button
                                className="btn btn-square btn-ghost"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                                     className="inline-block h-5 w-5 stroke-current">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                          d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="bg-base-200 md:hidden">
                    <ul className="menu menu-vertical p-4">
                        <li><Link href="/reviews">Reviews</Link></li>
                        <li><Link href="/products">Products</Link></li>
                        <li><Link href="/about">About Us</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                        {auth.user ? (
                            <>
                                <li><Link href="/dashboard">Dashboard</Link></li>
                                <li>
                                    <Link href={route('logout')} method="post" as="button">
                                        Logout
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li><Link href="/login">Login</Link></li>
                        )}
                    </ul>
                </div>
            )}

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-neutral p-8 text-neutral-content">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        <div>
                            <h3 className="mb-4 text-lg font-bold">{tenant.company_name}</h3>
                            <p className="text-sm">{tenant.address}</p>
                            <p className="text-sm">{tenant.phone}</p>
                        </div>
                        <div>
                            <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><Link href="/reviews">Reviews</Link></li>
                                <li><Link href="/products">Products</Link></li>
                                <li><Link href="/about">About Us</Link></li>
                                <li><Link href="/contact">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 text-lg font-bold">Legal</h3>
                            <ul className="space-y-2">
                                <li><Link href="/privacy">Privacy Policy</Link></li>
                                <li><Link href="/terms">Terms of Service</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 text-lg font-bold">Connect With Us</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="btn btn-circle btn-ghost">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" className="btn btn-circle btn-ghost">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="btn btn-circle btn-ghost">
                                    <i className="fab fa-instagram"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-neutral-content/20 pt-8 text-center">
                        <p>&copy; {new Date().getFullYear()} {tenant.company_name}. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}