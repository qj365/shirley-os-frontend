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
  console.log(getProductsResponse, '_');
  const productListSection = (categoryId?: string) => {
    if (
      !categoryId &&
      Array.isArray(getProductsResponse) &&
      getProductsResponse?.length
    ) {
      return (
        <div className="space-y-15">
          {getProductsResponse.map((item, index) => (
            <ProductsCarousel
              key={index}
              categoryName={item.name}
              products={item?.products as any}
            />
          ))}
        </div>
      );
    }

    if (
      categoryId &&
      !Array.isArray(getProductsResponse) &&
      getProductsResponse?.data?.length
    ) {
      return (
        <ProductList
          categoryName={
            categories?.find(item => item?.id === Number(categoryId))?.name ||
            ''
          }
          initData={getProductsResponse}
        />
      );
    }
    return <EmptyShop />;
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
