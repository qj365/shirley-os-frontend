'use client';

import ImageGallery from '@/components/product-detail/image-gallery';
import MainSection from '@/components/product-detail/main-section';
import {
  getProductById,
  getProductsByCategory,
  MedusaProduct,
} from '@/services/product-service';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ProductDetailContent() {
  const [product, setProduct] = useState<MedusaProduct | null>(null);
  const [additionalProducts, setAdditionalProducts] = useState<MedusaProduct[]>(
    []
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const categoryId = searchParams.get('category') || '';

  // Fetch product data using Medusa's product service
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        if (!productId) {
          console.error(
            'ProductDetail: No product ID provided in search params'
          );
          setLoading(false);
          return;
        }
        const categoryProducts = await getProductsByCategory(categoryId);
        if (categoryProducts.length > 0) {
          // Find the main product from the category products using productId
          const mainProduct = categoryProducts.find(
            (product: MedusaProduct) => product.id === productId
          );

          if (mainProduct) {
            setProduct(mainProduct);
            // Filter out the main product from related products
            setAdditionalProducts(
              categoryProducts.filter(
                (product: MedusaProduct) => product.id !== productId
              )
            );
          } else {
            // If main product not found in category products, fetch it directly
            const productData = await getProductById(productId);
            setProduct(productData);
            setAdditionalProducts(categoryProducts);
          }
        }
      } catch (error) {
        console.error('ProductDetail: Error fetching product:', error);
        setProduct(null);
        setAdditionalProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId, categoryId]);

  // if (loading) {
  //   return (
  //     <div className="w-full min-h-screen flex items-center justify-center">
  //       <Loading />
  //     </div>
  //   )
  // }

  if (!product) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-8">
        <div className="mb-4 text-xl">Product not found</div>
        <button
          onClick={() => window.history.back()}
          className="rounded-full bg-black px-6 py-3 text-white hover:bg-gray-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Prepare image data for the ImageGallery component
  const imageData = {
    images:
      product.images?.map(img => ({
        url: img.url,
        alt_text: product.title || null,
      })) || [],
    thumbnail: product.thumbnail || '',
    title: product.title,
  };

  return (
    <div className="flex w-full flex-col pt-20 md:pt-36 lg:flex-row lg:pt-35">
      <div className="w-full lg:w-1/2">
        <ImageGallery {...imageData} />
      </div>
      <div className="w-full lg:w-1/2">
        <MainSection
          product={product}
          additionalProducts={additionalProducts}
        />
      </div>
    </div>
  );
}

export default function ProductDetail() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading product...
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
