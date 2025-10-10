"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import ImageGallery from "@/components/product-detail/image-gallery"
import MainSection from "@/components/product-detail/main-section"
import { getProductById, getProductsByCategory } from "@/services/product-service"
import { MedusaProduct } from "@/services/product-service"
import Loading from "@/components/shared/loading"

export default function ProductDetail() {
  const [product, setProduct] = useState<MedusaProduct | null>(null)
  const [additionalProducts, setAdditionalProducts] = useState<MedusaProduct[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')
  const categoryId = searchParams.get('category') || ''

  // Fetch product data using Medusa's product service
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        if (!productId) {
          console.error("ProductDetail: No product ID provided in search params");
          setLoading(false);
          return;
        }
        const categoryProducts = await getProductsByCategory(categoryId);
        if (categoryProducts.length > 0) {
          
          // Find the main product from the category products using productId
          const mainProduct = categoryProducts.find(product => product.id === productId);
          
          if (mainProduct) {
            setProduct(mainProduct);
            // Filter out the main product from related products
            setAdditionalProducts(categoryProducts.filter(product => product.id !== productId));
          } else {
            // If main product not found in category products, fetch it directly
            const productData = await getProductById(productId);
            setProduct(productData);
            setAdditionalProducts(categoryProducts);
          }
        } 
      } catch (error) {
        console.error("ProductDetail: Error fetching product:", error);
        setProduct(null);
        setAdditionalProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
  }, [productId, categoryId]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-8">
        <div className="text-xl mb-4">Product not found</div>
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800"
        >
          Go Back
        </button>
      </div>
    )
  }

  // Prepare image data for the ImageGallery component
  const imageData = {
    images: product.images?.map(img => ({
      url: img.url,
      alt_text: product.title || null
    })) || [],
    thumbnail: product.thumbnail || '',
    title: product.title
  };

  return (
    <div className="w-full pt-20 md:pt-36 lg:pt-35 flex flex-col lg:flex-row">
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
  )
}