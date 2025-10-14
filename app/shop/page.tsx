/* eslint-disable @typescript-eslint/no-explicit-any */
import EmptyShop from '@/components/shop/EmptyShop';
import ProductCategories from '@/components/shop/ProductCategories';
import ProductList from '@/components/shop/ProductList';
import ProductsCarousel from '@/components/shop/ProductsCarousel';
import Recipes from '@/components/shop/recipes';
import ShopHeroSection from '@/components/shop/shopHeroSection';
import { api } from '@/src/lib/api/customer';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { ObjectType } from '@/utils/types';

async function fetchCategories() {
  try {
    return await api.category.getCategories();
  } catch {
    return [];
  }
}

async function fetchProductsByCategory(
  categoryId?: string,
  queryParams?: ObjectType
) {
  try {
    if (!categoryId) {
      return await api.product.getAllProducts();
    } else {
      return await api.product.getProductsByCategory({
        categoryId: Number(categoryId),
        ...(queryParams && queryParams),
      });
    }
  } catch {
    return [];
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { categoryId } = await searchParams;
  const categories = await fetchCategories();
  const getProductsResponse = await fetchProductsByCategory(
    categoryId as string,
    {
      pageSize: DEFAULT_PAGE_SIZE,
    }
  );
  // Helper to get category name by ID
  const getCategoryName = (categoryId: string) => {
    return (
      categories?.find(item => item?.id === Number(categoryId))?.name || ''
    );
  };

  // Render all products grouped by category
  const renderAllProductsCarousel = () => {
    if (!Array.isArray(getProductsResponse)) return null;
    if (getProductsResponse.length === 0) return null;

    // Filter categories that have products
    const categoriesWithProducts = getProductsResponse.filter(
      item => item?.products && item.products.length > 0
    );

    if (categoriesWithProducts.length === 0) return null;

    return (
      <div className="space-y-15">
        {categoriesWithProducts.map((item, index) => (
          <ProductsCarousel
            key={index}
            categoryName={item.name}
            products={item?.products as any}
          />
        ))}
      </div>
    );
  };

  // Render products for specific category
  const renderCategoryProducts = (categoryId: string) => {
    if (Array.isArray(getProductsResponse)) return null;

    const hasProducts = getProductsResponse?.data?.length;
    const categoryName = getCategoryName(categoryId);

    if (hasProducts) {
      return (
        <ProductList
          categoryName={categoryName}
          initData={getProductsResponse}
        />
      );
    }

    return (
      <section className="mx-auto flex w-full flex-col gap-10">
        <h2 className="text-lg font-bold md:text-[25px]">{categoryName}</h2>
        <EmptyShop />
      </section>
    );
  };

  // Main render logic
  const productListSection = (categoryId?: string) => {
    if (!categoryId) {
      return renderAllProductsCarousel();
    }
    return renderCategoryProducts(categoryId);
  };

  return (
    <div className="relative w-full bg-white">
      {/* Hero Section */}
      <ShopHeroSection />
      {/* Product Categories */}
      <section className="container py-12 sm:py-16 lg:py-20">
        <ProductCategories
          categories={categories}
          selectedCategoryId={categoryId as string}
        />

        {productListSection(categoryId as string)}
      </section>
      <Recipes />
    </div>
  );
}
