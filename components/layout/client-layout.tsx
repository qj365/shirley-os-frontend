'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import Navbar from './navbar';
import Footer from './footer';
import { Raleway } from 'next/font/google';
import { Toaster } from 'sonner';
import { CartProvider } from '@/services/cart-service';

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
      '/shop',
      '/wholesale',
      '/about',
      '/signin',
      '/recipe',
      '/recipes',
      '/dashboard',
      '/order-confirmation',
      '/faq',
    ];

    // Special case for product detail page
    if (pathname?.includes('/shop/product_detail')) return true;

    // Other shop pages don't show navbar
    if (pathname?.startsWith('/shop/')) return false;

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
    <html lang="en" className={raleway.className}>
      <body className="relative">
        {/* Sonner Toaster component */}
        <Toaster position="top-right" closeButton richColors />

        {/* Wrap everything in CartProvider */}
        <CartProvider>
          <div className={`transition-all duration-300`}>
            {showNavbar() && <Navbar key={pathname} />}
            {children}
            {!isAuthPage() &&
              !pathname?.includes('/shop/product_detail') &&
              !pathname?.includes('/checkout') && <Footer />}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
