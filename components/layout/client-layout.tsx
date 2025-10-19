'use client';

import { Raleway } from 'next/font/google';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Toaster } from 'sonner';
import Footer from './footer';
import Navbar from './navbar';

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNavbar = () => {
    const showPaths = [
      '/',
      '/checkout',
      '/order',
      '/shop',
      '/wholesale',
      '/about',
      '/signin',
      '/recipe',
      '/recipes',
      '/dashboard',
      '/faq',
    ];

    // Special case for product detail page
    if (pathname?.includes('/shop/product_detail')) return true;

    if (pathname?.startsWith('/shop/')) return true;

    if (pathname?.startsWith('/recipe/')) return true; // Show navbar for dynamic recipe routes

    if (pathname?.startsWith('/cooking-classes')) return true;

    return pathname ? showPaths.includes(pathname) : false;
  };

  // Check if the current page is an authentication page
  const isAuthPage = () => {
    const authPaths = ['/login', '/signup', '/reset-password'];
    return pathname ? authPaths.includes(pathname) : false;
  };

  return (
    <html lang="en" className={raleway.className} suppressHydrationWarning>
      <body className="relative">
        {/* Sonner Toaster component */}
        <Toaster position="top-right" closeButton richColors />

        <div className={`transition-all duration-300`}>
          {showNavbar() && <Navbar key={pathname} />}
          {children}
          {!isAuthPage() &&
            !pathname?.includes('/shop/product_detail') &&
            !pathname?.includes('/checkout') &&
            !pathname?.includes('/order') && <Footer />}
        </div>
      </body>
    </html>
  );
}
