"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import MainSection from "@/components/product-detail/main-section"
import { getProductById, MedusaProduct } from "@/services/product-service"
import Loading from "@/components/shared/loading"

export default function ProductDetail() {
  const [product, setProduct] = useState<MedusaProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const productId = params.id as string

  // Fetch product data using the getProductById service
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        console.log("ProductDetail: Fetching product with ID:", productId);
        // Use the dedicated getProductById function
        const foundProduct = await getProductById(productId)
        console.log("ProductDetail: Product fetched successfully:", foundProduct);
        setProduct(foundProduct)
      } catch (error) {
        console.error("ProductDetail: Error fetching product:", error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProductData()
    } else {
      console.error("ProductDetail: No product ID provided");
      setLoading(false);
    }
  }, [productId])

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
        <div className="text-gray-600 mb-4">Product ID: {productId}</div>
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Pass the fetched product as a prop to MainSection */}
      <MainSection product={product} additionalProducts={[]} />

      

      {/* <div className="w-full hidden md:block">
        <ShopBundles heading="More Like This" card={3} align="left" />
      </div> */}
    </>
  )
}
