/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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

  // Track if this is initial mount or props change from server
  const [isInitialMount, setIsInitialMount] = useState(true);

  // Update state when props change (after navigation from server)
  // Only update on initial mount or when initialCategoryId changes externally
  useEffect(() => {
    setCategories(initialCategories);
    setAllProducts(initialAllProducts);

    // Only sync with initialCategoryId on initial mount or when it changes from server
    if (isInitialMount || initialCategoryId !== selectedCategoryId) {
      // Only update if this is truly a server-side change, not user interaction
      if (isInitialMount) {
        setSelectedCategoryId(initialCategoryId);
        setCategoryProducts(initialCategoryProducts);
        setCategoryPagination(initialPagination);
        setIsInitialMount(false);
      } else if (
        initialCategoryId !== undefined &&
        initialCategoryId !== selectedCategoryId
      ) {
        // Server-side change (page refresh or navigation)
        setSelectedCategoryId(initialCategoryId);
        setCategoryProducts(initialCategoryProducts);
        setCategoryPagination(initialPagination);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialCategories,
    initialAllProducts,
    initialCategoryId,
    initialCategoryProducts,
    initialPagination,
    isInitialMount,
    // selectedCategoryId intentionally excluded to prevent conflicts with client-side changes
  ]);

  // Scroll position is automatically maintained since we don't use router navigation
  // No scroll restoration needed for client-side category changes

  // Fetch all products (optional - can be used to refresh data when clicking "All")

  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.product.getAllProducts();
      setAllProducts(response);
    } catch (err) {
      console.error('Error fetching all products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Track if we're handling a client-side category change
  const isClientSideChangeRef = useRef(false);

  // Track previous searchParams to detect external URL changes (browser back/forward)
  const prevSearchParamsRef = useRef(searchParams.toString());

  // Sync selectedCategoryId with URL query parameter (for browser back/forward only)
  // This only handles external URL changes, not client-side category clicks
  useEffect(() => {
    // Skip if this is a client-side change
    if (isClientSideChangeRef.current) {
      isClientSideChangeRef.current = false;
      prevSearchParamsRef.current = searchParams.toString();
      return;
    }

    const categoryFromUrl = searchParams.get('category');
    const currentSearchParams = searchParams.toString();

    // Only sync if URL changed externally (browser back/forward), not from client-side pushState
    const isExternalChange =
      prevSearchParamsRef.current !== currentSearchParams;
    prevSearchParamsRef.current = currentSearchParams;

    // Only sync if URL changed externally and it's different from current state
    if (isExternalChange && categoryFromUrl !== selectedCategoryId) {
      // If it matches initialCategoryId, use server-fetched data
      if (categoryFromUrl === initialCategoryId) {
        setSelectedCategoryId(categoryFromUrl || undefined);
        setCategoryProducts(initialCategoryProducts);
        setCategoryPagination(initialPagination);
      } else if (categoryFromUrl && categoryFromUrl !== initialCategoryId) {
        // URL changed externally (browser back/forward) - fetch client-side
        setSelectedCategoryId(categoryFromUrl);
        setCategoryProducts([]);
        setCategoryPagination({ hasMore: false });
        fetchProductsByCategory(categoryFromUrl);
      } else if (!categoryFromUrl) {
        // Reset to show all products
        setSelectedCategoryId(undefined);
        setCategoryProducts([]);
        setCategoryPagination({ hasMore: false });
      }
    }
  }, [
    searchParams,
    selectedCategoryId,
    initialCategoryId,
    initialCategoryProducts,
    initialPagination,
    fetchProductsByCategory,
  ]);

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
        onCategorySelect={categoryId => {
          // Handle category change client-side only
          // No navigation = no scroll issue

          // Mark this as a client-side change to prevent URL sync override
          isClientSideChangeRef.current = true;

          if (categoryId) {
            setSelectedCategoryId(categoryId);
            setCategoryProducts([]);
            setCategoryPagination({ hasMore: false });
            fetchProductsByCategory(categoryId);
          } else {
            // Click "All" - reset to show all products
            // Optionally refresh data to get latest products
            setSelectedCategoryId(undefined);
            setCategoryProducts([]);
            setCategoryPagination({ hasMore: false });

            fetchAllProducts();
          }
        }}
      />

      {/* Error message */}
      {error && <div className="mb-4 text-center text-red-500">{error}</div>}

      {/* Product List Section */}
      {renderProductSection()}
    </div>
  );
}
