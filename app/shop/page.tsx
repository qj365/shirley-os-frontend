import OurRecipes from '@/components/landing/our-recipes';
import ShopHeroSection from '@/components/shop/shopHeroSection';
import ShopProductSection from '@/components/shop/shopProductSection';

export default function ShopPage() {
  return (
    <div>
      {/* Hero Section */}
      <ShopHeroSection />
      {/* Product Categories */}
      <ShopProductSection />
      <OurRecipes isShowSeeMoreDetailBtn bgClassName="bg-[#FFFBF2]" />
    </div>
  );
}
