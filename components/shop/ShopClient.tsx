/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import {
  api,
  GetCategoriesResponse,
  GetProductsByCategoryResponse,
  GetAllProductsResponse,
} from '@/src/lib/api/customer';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import ProductCategories from './ProductCategories';
import ProductList from './ProductList';
import ProductsCarousel from './ProductsCarousel';
import EmptyShop from './EmptyShop';

interface ShopClientProps {
  initialCategories: GetCategoriesResponse[];
  initialAllProducts: GetAllProductsResponse;
}

export default function ShopClient({
  initialCategories,
  initialAllProducts,
}: ShopClientProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(undefined);
  const [categories, setCategories] = useState(initialCategories);
  const [allProducts, setAllProducts] = useState(initialAllProducts);
  const [categoryProducts, setCategoryProducts] = useState<
    GetProductsByCategoryResponse[]
  >([]);
  const [categoryPagination, setCategoryPagination] = useState<{
    nextCursor?: string;
    hasMore: boolean;
  }>({ hasMore: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Fetch products by category
  const fetchProductsByCategory = async (
    categoryId: string,
    cursor?: string,
    append = false
  ) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.product.getProductsByCategory({
        categoryId: Number(categoryId),
        cursor,
        pageSize: DEFAULT_PAGE_SIZE,
      });

      if (append) {
        setCategoryProducts(prev => [...prev, ...response.data]);
      } else {
        setCategoryProducts(response.data);
      }

      setCategoryPagination({
        nextCursor: response.nextCursor,
        hasMore: !!response.nextCursor,
      });
    } catch (err) {
      console.error('Error fetching products by category:', err);
      setError('Failed to load products');
      // On error, set products to empty array to show empty shop
      setCategoryProducts([]);
      setCategoryPagination({ hasMore: false });
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string | undefined) => {
    setSelectedCategoryId(categoryId);

    if (categoryId) {
      // Reset products list to empty before fetching new data
      setCategoryProducts([]);
      setCategoryPagination({ hasMore: false });
      // Fetch products for specific category
      fetchProductsByCategory(categoryId);
    } else {
      // Reset to show all products
      setCategoryProducts([]);
      setCategoryPagination({ hasMore: false });
    }
  };

  // Load more products for current category
  const handleLoadMore = () => {
    if (selectedCategoryId && categoryPagination.nextCursor) {
      fetchProductsByCategory(
        selectedCategoryId,
        categoryPagination.nextCursor,
        true
      );
    }
  };

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    return (
      categories?.find(item => item?.id === Number(categoryId))?.name || ''
    );
  };

  // Render all products grouped by category (carousel view)
  const renderAllProductsCarousel = () => {
    if (!allProducts?.length) {
      return (
        <section className="mx-auto flex w-full flex-col gap-10">
          <EmptyShop />
        </section>
      );
    }

    // Filter categories that have products
    const categoriesWithProducts = allProducts.filter(
      item => item?.products && item.products.length > 0
    );

    if (categoriesWithProducts.length === 0) {
      return (
        <section className="mx-auto flex w-full flex-col gap-10">
          <EmptyShop />
        </section>
      );
    }

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

  // Render products for specific category (list view)
  const renderCategoryProducts = (categoryId: string) => {
    const categoryName = getCategoryName(categoryId);

    // Show loading state only when actually loading
    if (loading) {
      return (
        <section className="mx-auto flex w-full flex-col gap-10">
          <h2 className="text-lg font-bold md:text-[25px]">{categoryName}</h2>
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-yellow-500"></div>
          </div>
        </section>
      );
    }

    // Show products when we have data
    if (categoryProducts.length > 0) {
      return (
        <ProductList
          categoryName={categoryName}
          products={categoryProducts}
          hasMore={categoryPagination.hasMore}
          loading={loading}
          onLoadMore={handleLoadMore}
        />
      );
    }

    // Show empty state when no products found (after API call completed)
    return (
      <section className="mx-auto flex w-full flex-col gap-10">
        <h2 className="text-lg font-bold md:text-[25px]">{categoryName}</h2>
        <EmptyShop />
      </section>
    );
  };

  // Main render logic
  const renderProductSection = () => {
    if (!selectedCategoryId) {
      return renderAllProductsCarousel();
    }
    return renderCategoryProducts(selectedCategoryId);
  };

  return (
    <div className="container py-12 sm:py-16 lg:py-20">
      {/* Product Categories */}
      <ProductCategories
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategorySelect={handleCategorySelect}
      />

      {/* Error message */}
      {error && <div className="mb-4 text-center text-red-500">{error}</div>}

      {/* Product List Section */}
      {renderProductSection()}
    </div>
  );
}
