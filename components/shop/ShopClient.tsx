/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
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
  initialCategoryId?: string;
  initialCategoryProducts?: GetProductsByCategoryResponse[];
  initialPagination?: {
    nextCursor?: string;
    hasMore: boolean;
  };
}

export default function ShopClient({
  initialCategories,
  initialAllProducts,
  initialCategoryId,
  initialCategoryProducts = [],
  initialPagination = { hasMore: false },
}: ShopClientProps) {
  const searchParams = useSearchParams();
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(initialCategoryId);
  const [categories, setCategories] = useState(initialCategories);
  const [allProducts, setAllProducts] = useState(initialAllProducts);
  const [categoryProducts, setCategoryProducts] = useState<
    GetProductsByCategoryResponse[]
  >(initialCategoryProducts);
  const [categoryPagination, setCategoryPagination] = useState<{
    nextCursor?: string;
    hasMore: boolean;
  }>(initialPagination);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Update state when props change (after navigation)
  useEffect(() => {
    setCategories(initialCategories);
    setAllProducts(initialAllProducts);
    if (initialCategoryId !== selectedCategoryId) {
      setSelectedCategoryId(initialCategoryId);
      setCategoryProducts(initialCategoryProducts);
      setCategoryPagination(initialPagination);
    }
  }, [
    initialCategories,
    initialAllProducts,
    initialCategoryId,
    initialCategoryProducts,
    initialPagination,
    selectedCategoryId,
  ]);

  // Fetch products by category
  const fetchProductsByCategory = useCallback(
    async (categoryId: string, cursor?: string, append = false) => {
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
    },
    []
  );

  // Sync selectedCategoryId with URL query parameter (for browser back/forward)
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    // Only update if URL changed and it's different from current state
    // and different from initial props (which means it was already fetched server-side)
    if (categoryFromUrl !== selectedCategoryId) {
      // If it matches initialCategoryId, props will handle it
      if (categoryFromUrl === initialCategoryId) {
        setSelectedCategoryId(categoryFromUrl || undefined);
        setCategoryProducts(initialCategoryProducts);
      } else if (categoryFromUrl && categoryFromUrl !== initialCategoryId) {
        // Only fetch if URL changed and it's not the initial category
        setSelectedCategoryId(categoryFromUrl);
        fetchProductsByCategory(categoryFromUrl);
      } else if (!categoryFromUrl) {
        // Reset to show all products
        setSelectedCategoryId(undefined);
        setCategoryProducts([]);
        setCategoryPagination({ hasMore: false });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
      />

      {/* Error message */}
      {error && <div className="mb-4 text-center text-red-500">{error}</div>}

      {/* Product List Section */}
      {renderProductSection()}
    </div>
  );
}
