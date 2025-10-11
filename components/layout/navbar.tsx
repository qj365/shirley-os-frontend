"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { CartSheet } from "@/components/shared/cart-sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import Logout from "@/components/auth/logout";
import { useAuth } from "@/hooks/auth";
import { useCart } from "@/services/cart-service";

// Helper functions for cleaner code
const getRouteStyles = (pathname: string) => {
  const isLightRoute = ['/checkout', '/', '/dashboard', '/order-confirmation'].includes(pathname) || 
                      pathname.startsWith('/recipe') || 
                      pathname.includes('/shop/product_detail');
  const isDarkRoute = ['/shop', '/wholesale', '/about', '/faq'].includes(pathname);

  return {
    textColor: isLightRoute ? "text-black" : isDarkRoute ? "text-white" : "text-black",
    logoSrc: isLightRoute ? "/image/Logo_Charcoal_Black.png" : "/image/Logo_white.png",
    buttonStyles: isLightRoute || isDarkRoute 
      ? "bg-black text-white hover:bg-black hover:text-white border-black" 
      : "bg-black text-white hover:bg-white hover:text-black border-black",
    isLightRoute,
    isDarkRoute
  };
};

const CartButton = ({ totalQuantity, size = 24, className = "" }: { totalQuantity: number; size?: number; className?: string }) => (
  <CartSheet>
    <Button variant="ghost" size="icon" className={`relative h-10 w-10 ${className}`}>
      <ShoppingCart size={size} color="red" />
      {totalQuantity > 0 && (
        <Badge
          variant="secondary"
          className={`absolute text-red-500 -right-2 -top-2 ${size > 30 ? 'h-7 w-7' : 'h-5 w-5'} rounded-full p-0 flex items-center justify-center ${size > 30 ? '' : 'text-xs'}`}
        >
          {totalQuantity}
        </Badge>
      )}
    </Button>
  </CartSheet>
);

const NavigationLinks = ({ pathname, textColor, onLinkClick }: { pathname: string; textColor: string; onLinkClick?: () => void }) => {
  const linkClass = (path: string) => 
    `font-semibold text-lg lg:text-xl xl:text-2xl transition-colors hover:text-red-600 ${
      pathname === path ? "text-red-600" : textColor
    }`;

  return (
    <>
      <Link href="/" className={linkClass("/")} onClick={onLinkClick}>
        Home
      </Link>
      <Link href="/shop" className={linkClass("/shop")} onClick={onLinkClick}>
        Shop
      </Link>
      <Link href="/about" className={linkClass("/about")} onClick={onLinkClick}>
        About
      </Link>
      <Link href="/faq" className={linkClass("/faq")} onClick={onLinkClick}>
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
  isDarkRoute = false
}: {
  isAuthenticated: boolean;
  buttonStyles: string;
  router: ReturnType<typeof useRouter>;
  isMobile?: boolean;
  onActionComplete?: () => void;
  isDarkRoute?: boolean;
}) => {
  if (!isAuthenticated) {
    return (
      <Link href="/login">
        <button
          className={`font-semibold ${isMobile ? 'text-xl py-2 px-8' : 'text-lg lg:text-xl xl:text-2xl py-1 px-4 lg:py-2 lg:px-6'} rounded-full border-2 ${
            isMobile ? 'bg-[#fabc20] text-black hover:bg-black hover:text-white border-[#fabc20]' : buttonStyles
          } active:scale-95 transition-colors ${isMobile ? 'mt-2' : ''}`}
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
          className="font-semibold text-xl py-2 px-8 rounded-full border-2 bg-[#fabc20] text-black hover:bg-black hover:text-white border-[#fabc20] active:scale-95 transition-colors mt-2"
        >
          Account
        </button>
        <Logout onLogoutSuccess={onActionComplete} textColor="text-black hover:text-gray-700" />
      </>
    );
  }

  // Desktop authenticated state - Account button and Logout link
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => router.push('/dashboard')}
        className={`font-semibold text-lg lg:text-xl xl:text-2xl py-1 px-4 lg:py-2 lg:px-6 rounded-full border-2 ${buttonStyles} active:scale-95 transition-colors`}
      >
        Account
      </button>
      <Logout textColor={isDarkRoute ? "text-white hover:text-gray-300" : "text-gray-700 hover:text-gray-900"} />
    </div>
  );
};

const SimplifiedAuthHeader = ({ pathname }: { pathname: string }) => (
  <div className="bg-white shadow-sm py-2">
    <div className="container mx-auto px-4 flex justify-between items-center">
      <Link href="/">
        <div className="w-[150px] h-[34px] flex justify-center items-center">
          <Image
            src="/image/Logo_Charcoal_Black.png"
            alt="Shirley's Logo"
            width={150}
            height={34}
            className="object-contain w-full h-full"
          />
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Link href="/login">
            <button className="px-4 py-1 border border-[#592FF4] text-[#592FF4] rounded-md hover:bg-[#592FF4] hover:text-white transition-colors">
              Login
            </button>
          </Link>
          {pathname !== "/signup" && (
            <Link href="/signup">
              <button className="px-4 py-1 bg-[#fabc20] text-black rounded-md hover:bg-[#f5c508] transition-colors">
                Sign Up
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  </div>
);

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFloatingCart, setShowFloatingCart] = useState(false);
  const { cart } = useCart();
  const totalQuantity = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const isFullNavbar = pathname !== "/login" && pathname !== "/signup";
  const routeStyles = getRouteStyles(pathname);

  // Handle scroll event for floating cart
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCart(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Simplified auth header for login/signup pages
  if (!isFullNavbar) {
    return <SimplifiedAuthHeader pathname={pathname} />;
  }

  // Main navbar
  return (
    <>
      <div className="absolute top-6 sm:top-8 md:top-10 lg:top-12 w-full px-6 z-50">
        <div className="flex justify-between items-center w-full mx-auto transition-all duration-500">
          {/* Logo */}
          <Link href="/" className="w-[150px] h-[34px] sm:w-[170px] sm:h-[38px] md:w-[190px] md:h-[43px] lg:w-[210px] lg:h-[47px] flex justify-center items-center">
            <Image
              src={routeStyles.logoSrc}
              alt="Shirley's Logo"
              width={210}
              height={47}
              className="object-contain w-full h-full"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
            <NavigationLinks pathname={pathname} textColor={routeStyles.textColor} />
            <CartButton totalQuantity={totalQuantity} size={50} />
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <CartButton totalQuantity={totalQuantity} />
            <button 
              onClick={toggleMenu} 
              className={`text-2xl focus:outline-none ${routeStyles.isLightRoute ? "text-black" : "text-white"}`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:block">
            <AuthSection 
              isAuthenticated={isAuthenticated}
              buttonStyles={routeStyles.buttonStyles}
              router={router}
              isDarkRoute={routeStyles.isDarkRoute}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-[#fffbf0] border border-gray-200 w-full absolute left-0 mt-2 overflow-hidden transition-all duration-300 ease-in-out z-50
          ${isMenuOpen ? "max-h-[400px] opacity-100 pb-4 px-6" : "max-h-0 opacity-0 py-0 px-6"}`}
        >
          <nav className={`flex flex-col items-center gap-6 transition-transform duration-300 ${isMenuOpen ? "translate-y-0" : "-translate-y-10"}`}>
            <div className="w-full pb-2 mb-2"></div>
            <NavigationLinks pathname={pathname} textColor="text-black" onLinkClick={closeMenu} />
            <AuthSection 
              isAuthenticated={isAuthenticated}
              buttonStyles={routeStyles.buttonStyles}
              router={router}
              isMobile={true}
              onActionComplete={closeMenu}
              isDarkRoute={routeStyles.isDarkRoute}
            />
          </nav>
        </div>
      </div>

      {/* Floating Cart Button for Mobile */}
      {totalQuantity > 0 && showFloatingCart && (
        <div className="fixed bottom-6 right-6 md:hidden z-50">
          <CartSheet>
            <Button 
              variant="default" 
              size="icon" 
              className="h-14 w-14 rounded-full shadow-lg bg-red-600 hover:bg-red-700 transition-all duration-300 flex items-center justify-center"
            >
              <ShoppingCart size={24} color="white" className="relative" />
              <Badge
                variant="secondary"
                className="absolute -right-1 -top-1 h-6 w-6 bg-[#fabc20] text-black rounded-full p-0 flex items-center justify-center text-xs font-bold"
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