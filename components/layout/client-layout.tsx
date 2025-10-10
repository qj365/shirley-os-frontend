import { CartProvider } from '@/services/cart-service';
import { headers } from 'next/headers';
import React from 'react';
import { Toaster } from 'sonner';
import Footer from './footer';
import Navbar from './navbar';

type Props = {
  children: React.ReactNode;
};

export default async function ClientLayout({ children }: Props) {
  const headersList = await headers();

  const pathname = headersList.get('x-url-pathname');

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
      '/wholesale',
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
    <>
      {/* Sonner Toaster component */}
      <Toaster position="top-right" closeButton richColors />

      {/* Wrap everything in CartProvider */}
      <CartProvider>
        <div className={`transition-all duration-300`}>
          {showNavbar() && <Navbar key={pathname} />}
          <main className="min-h-screen">{children}</main>
          {!isAuthPage() &&
            !pathname?.includes('/shop/product_detail') &&
            !pathname?.includes('/checkout') && <Footer />}
        </div>
      </CartProvider>
    </>
  );
}
