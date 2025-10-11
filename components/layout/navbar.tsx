'use client';
import Logout from '@/components/auth/logout';
import { CartSheet } from '@/components/shared/cart-sheet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth';
import { useCart } from '@/services/cart-service';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

// Helper functions for cleaner code
const getRouteStyles = (pathname: string) => {
  const isCookingClassBookingPage =
    pathname.startsWith('/cooking-classes/') && pathname.endsWith('/booking');

  const isWhiteMode =
    ['/shop', '/wholesale', '/about', '/faq', '/cooking-classes'].includes(
      pathname
    ) || isCookingClassBookingPage;

  return {
    textColor: isWhiteMode ? 'text-white' : 'text-black',
    logoSrc: isWhiteMode
      ? '/image/Logo_white.png'
      : '/image/Logo_Charcoal_Black.png',
    buttonStyles: isWhiteMode
      ? 'bg-white text-black hover:opacity-80 border-white'
      : 'bg-black text-white hover:opacity-80 border-black',
    isWhiteMode,
  };
};

const CartButton = ({
  totalQuantity,
  size = 24,
  className = '',
}: {
  totalQuantity: number;
  size?: number;
  className?: string;
}) => (
  <CartSheet>
    <Button
      variant="ghost"
      size="icon"
      className={`relative h-10 w-10 ${className}`}
    >
      <ShoppingCart size={size} color="red" />
      {totalQuantity > 0 && (
        <Badge
          variant="secondary"
          className={`absolute -top-2 -right-2 text-red-500 ${size > 30 ? 'h-7 w-7' : 'h-5 w-5'} flex items-center justify-center rounded-full p-0 ${size > 30 ? '' : 'text-xs'}`}
        >
          {totalQuantity}
        </Badge>
      )}
    </Button>
  </CartSheet>
);

const NavigationLinks = ({
  pathname,
  textColor,
  onLinkClick,
}: {
  pathname: string;
  textColor: string;
  onLinkClick?: () => void;
}) => {
  const linkClass = (path: string) =>
    `font-semibold text-lg lg:text-xl xl:text-2xl transition-colors hover:text-red-600 ${
      pathname === path ? 'text-red-600' : textColor
    }`;

  return (
    <>
      <Link href="/" className={linkClass('/')} onClick={onLinkClick}>
        Home
      </Link>
      <Link href="/shop" className={linkClass('/shop')} onClick={onLinkClick}>
        Shop
      </Link>
      <Link
        href="/cooking-classes"
        className={linkClass('/cooking-classes')}
        onClick={onLinkClick}
      >
        Class
      </Link>
      <Link href="/about" className={linkClass('/about')} onClick={onLinkClick}>
        About
      </Link>
      <Link href="/faq" className={linkClass('/faq')} onClick={onLinkClick}>
        FAQ
      </Link>
    </>
  );
};

const AuthSection = ({
  isAuthenticated,
  buttonStyles,
  router,
  isMobile = false,
  onActionComplete,
  isWhiteMode = false,
}: {
  isAuthenticated: boolean;
  buttonStyles: string;
  router: ReturnType<typeof useRouter>;
  isMobile?: boolean;
  onActionComplete?: () => void;
  isWhiteMode?: boolean;
}) => {
  if (!isAuthenticated) {
    return (
      <Link href="/login">
        <button
          className={`font-semibold ${isMobile ? 'px-8 py-2 text-xl' : 'px-4 py-1 text-lg lg:px-6 lg:py-2 lg:text-xl xl:text-2xl'} rounded-full border-2 ${
            isMobile
              ? 'border-[#fabc20] bg-[#fabc20] text-black hover:bg-black hover:text-white'
              : buttonStyles
          } transition-colors active:scale-95 ${isMobile ? 'mt-2' : ''}`}
        >
          Login
        </button>
      </Link>
    );
  }

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => {
            router.push('/dashboard');
            onActionComplete?.();
          }}
          className="mt-2 rounded-full border-2 border-[#fabc20] bg-[#fabc20] px-8 py-2 text-xl font-semibold text-black transition-colors hover:bg-black hover:text-white active:scale-95"
        >
          Account
        </button>
        <Logout
          onLogoutSuccess={onActionComplete}
          textColor="text-black hover:text-gray-700"
        />
      </>
    );
  }

  // Desktop authenticated state - Account button and Logout link
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => router.push('/dashboard')}
        className={`rounded-full border-2 px-4 py-1 text-lg font-semibold lg:px-6 lg:py-2 lg:text-xl xl:text-2xl ${buttonStyles} transition-colors active:scale-95`}
      >
        Account
      </button>
      <Logout
        textColor={
          isWhiteMode
            ? 'text-white hover:text-gray-300'
            : 'text-gray-700 hover:text-gray-900'
        }
      />
    </div>
  );
};

const SimplifiedAuthHeader = ({ pathname }: { pathname: string }) => (
  <div className="bg-white py-2 shadow-sm">
    <div className="container mx-auto flex items-center justify-between px-4">
      <Link href="/">
        <div className="flex h-[34px] w-[150px] items-center justify-center">
          <Image
            src="/image/Logo_Charcoal_Black.png"
            alt="Shirley's Logo"
            width={150}
            height={34}
            className="h-full w-full object-contain"
          />
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Link href="/login">
            <button className="rounded-md border border-[#592FF4] px-4 py-1 text-[#592FF4] transition-colors hover:bg-[#592FF4] hover:text-white">
              Login
            </button>
          </Link>
          {pathname !== '/signup' && (
            <Link href="/signup">
              <button className="rounded-md bg-[#fabc20] px-4 py-1 text-black transition-colors hover:bg-[#f5c508]">
                Sign Up
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  </div>
);

const initCustomNavStyles = {
  textColor: 'text-black',
  logoSrc: '/image/Logo_Charcoal_Black.png',
  buttonStyles:
    'bg-black text-white hover:bg-black hover:text-white border-black',
  isWhiteMode: false,
};

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { cart } = useCart();
  const totalQuantity =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const isFullNavbar = pathname !== '/login' && pathname !== '/signup';

  const [customNavStyles, setCustomNavStyles] = useState(initCustomNavStyles);
  const [isMenuScrolled, setIsMenuScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleScroll = useCallback(() => {
    if (window.scrollY > 80) {
      setIsMenuScrolled(true);
    } else {
      setIsMenuScrolled(false);
    }
  }, []);

  useEffect(() => {
    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (isMenuScrolled) {
      setCustomNavStyles(initCustomNavStyles);
      return;
    }
    setCustomNavStyles(getRouteStyles(pathname));
  }, [isMenuScrolled, pathname]);

  // Simplified auth header for login/signup pages
  if (!isFullNavbar) {
    return <SimplifiedAuthHeader pathname={pathname} />;
  }

  // Main navbar
  return (
    <>
      <div
        className={cn(
          'fixed top-0 right-0 left-0 z-[90] bg-transparent px-6 py-6 transition-all duration-100 md:py-12',
          isMenuScrolled && 'bg-white !py-4 shadow'
        )}
      >
        <div className="mx-auto flex w-full items-center justify-between transition-all duration-500">
          {/* Logo */}
          <Link
            href="/"
            className="flex h-[34px] w-[150px] items-center justify-center sm:h-[38px] sm:w-[170px] md:h-[43px] md:w-[190px] lg:h-[47px] lg:w-[210px]"
          >
            <Image
              src={customNavStyles.logoSrc}
              alt="Shirley's Logo"
              width={210}
              height={47}
              className="h-full w-full object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-4 md:flex lg:gap-6 xl:gap-8">
            <NavigationLinks
              pathname={pathname}
              textColor={customNavStyles.textColor}
            />
            <CartButton totalQuantity={totalQuantity} size={50} />
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <CartButton totalQuantity={totalQuantity} />
            <button
              onClick={toggleMenu}
              className={`text-2xl focus:outline-none ${customNavStyles.isWhiteMode ? 'text-white' : 'text-black'}`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:block">
            <AuthSection
              isAuthenticated={isAuthenticated}
              buttonStyles={customNavStyles.buttonStyles}
              router={router}
              isWhiteMode={customNavStyles.isWhiteMode}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`absolute left-0 z-50 mt-2 w-full overflow-hidden border border-gray-200 bg-[#fffbf0] transition-all duration-300 ease-in-out md:hidden ${isMenuOpen ? 'max-h-[400px] px-6 pb-4 opacity-100' : 'max-h-0 px-6 py-0 opacity-0'}`}
        >
          <nav
            className={`flex flex-col items-center gap-6 transition-transform duration-300 ${isMenuOpen ? 'translate-y-0' : '-translate-y-10'}`}
          >
            <div className="mb-2 w-full pb-2"></div>
            <NavigationLinks
              pathname={pathname}
              textColor="text-black"
              onLinkClick={closeMenu}
            />
            <AuthSection
              isAuthenticated={isAuthenticated}
              buttonStyles={customNavStyles.buttonStyles}
              router={router}
              isMobile={true}
              onActionComplete={closeMenu}
              isWhiteMode={customNavStyles.isWhiteMode}
            />
          </nav>
        </div>
      </div>

      {/* Floating Cart Button for Mobile */}
      {totalQuantity > 0 && isMenuScrolled && (
        <div className="fixed right-6 bottom-6 z-50 md:hidden">
          <CartSheet>
            <Button
              variant="default"
              size="icon"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg transition-all duration-300 hover:bg-red-700"
            >
              <ShoppingCart size={24} color="white" className="relative" />
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#fabc20] p-0 text-xs font-bold text-black"
              >
                {totalQuantity}
              </Badge>
            </Button>
          </CartSheet>
        </div>
      )}
    </>
  );
}

export default Navbar;
