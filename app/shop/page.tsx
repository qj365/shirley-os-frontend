import { Suspense } from "react";
import ShopProductSection from "@/components/shop/shopProductSection";
import ShopHeroSection from "@/components/shop/shopHeroSection";
import Recipes from "@/components/shop/recipes";

export default function ShopPage() {
  return (
    <div className="relative w-full bg-white">
      {/* Hero Section */}
      <ShopHeroSection />
      {/* Product Categories */}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading products...</div>}>
        <ShopProductSection />
      </Suspense>
      <Recipes />
    </div>
  );
}
