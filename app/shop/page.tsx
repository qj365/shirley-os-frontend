import ShopClient from '@/components/shop/ShopClient';
import Recipes from '@/components/shop/recipes';
import ShopHeroSection from '@/components/shop/shopHeroSection';
import { api } from '@/src/lib/api/customer';

async function fetchCategories() {
  try {
    return await api.category.getCategories();
  } catch {
    return [];
  }
}

async function fetchAllProducts() {
  try {
    return await api.product.getAllProducts();
  } catch (e) {
    console.error('Error fetching all products ', e);
    return [];
  }
}

export default async function ShopPage() {
  console.log('NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL);

  const categories = await fetchCategories();
  const allProducts = await fetchAllProducts();
  console.log('allProducts', allProducts);
  console.log('categories', categories);

  return (
    <div className="relative w-full bg-white">
      {/* Hero Section */}
      <ShopHeroSection />

      {/* Shop Client Component */}
      <ShopClient
        initialCategories={categories}
        initialAllProducts={allProducts}
      />

      <Recipes />
    </div>
  );
}
