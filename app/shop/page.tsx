import ShopClient from '@/components/shop/ShopClient';
import Recipes from '@/components/shop/recipes';
import ShopHeroSection from '@/components/shop/shopHeroSection';
import { api, GetProductsByCategoryResponse } from '@/src/lib/api/customer';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

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

async function fetchProductsByCategory(categoryId: string) {
  try {
    const response = await api.product.getProductsByCategory({
      categoryId: Number(categoryId),
      pageSize: DEFAULT_PAGE_SIZE,
    });
    return {
      products: response.data,
      nextCursor: response.nextCursor,
      hasMore: !!response.nextCursor,
    };
  } catch (e) {
    console.error('Error fetching products by category ', e);
    return {
      products: [],
      nextCursor: undefined,
      hasMore: false,
    };
  }
}

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const categoryId = params.category;

  const categories = await fetchCategories();
  const allProducts = await fetchAllProducts();

  // Fetch initial category products if category is in URL
  let initialCategoryProducts: GetProductsByCategoryResponse[] = [];
  let initialPagination = {
    hasMore: false,
    nextCursor: undefined as string | undefined,
  };
  if (categoryId) {
    const categoryData = await fetchProductsByCategory(categoryId);
    initialCategoryProducts = categoryData.products;
    initialPagination = {
      hasMore: categoryData.hasMore,
      nextCursor: categoryData.nextCursor,
    };
  }

  return (
    <div className="relative w-full bg-white">
      {/* Hero Section */}
      <ShopHeroSection />

      {/* Shop Client Component */}
      <ShopClient
        initialCategories={categories}
        initialAllProducts={allProducts}
        initialCategoryId={categoryId}
        initialCategoryProducts={initialCategoryProducts}
        initialPagination={initialPagination}
      />

      <Recipes />
    </div>
  );
}
