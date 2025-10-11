"use client"

import { useState, Suspense } from "react"
import Skeleton from "react-loading-skeleton"
import { MedusaProduct } from "@/services/product-service"
import ProductDetailsModal from "./product-details-modal"
import { useCart } from "@/services/cart-service"

// Import all the smaller components
import MainProductInfo from "./main-product-info"
import MainProductCTA from "./main-product-cta"
import CartSummarySection from "./cart-summary-section"
import ActionButtonsSection from "./action-buttons-section"
import AdditionalProductsSection from "./additional-products-section"

interface MainSectionProps {
  product: MedusaProduct;
  additionalProducts: MedusaProduct[];
}

export default function MainSection({ product, additionalProducts}: MainSectionProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { cart } = useCart();
  
  if (!product) {
    return <div>Product not found</div>;
  }
  
  // Get the first variant and its price
  const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  const displayPrice = firstVariant?.calculated_price?.calculated_amount || 0;
  const originalPrice = firstVariant?.calculated_price?.original_amount || 0;
  const hasDiscount = originalPrice > displayPrice;
  
  // Check if product is out of stock - MODIFIED: All products are now out of stock
  const isOutOfStock = true; // Previously: firstVariant?.inventory_quantity === 0;
  
  // Extract metadata for additional product details
  const metadata = product.metadata || {};
  // Fix: Cast metadata properties to string to avoid 'unknown' type errors
  const ingredients = metadata.ingredients as string;
  const allergens = metadata.allergens as string;
  const nutritionalInfo = metadata.nutritional_info as string | Record<string, string | number | boolean>;
  const storageInstructions = metadata.storage_instructions as string;
  const shelfLife = metadata.shelf_life as string;
  const additionalInfo = metadata.additional_info as string | Record<string, string | number | boolean>;
  const backgroundColor = metadata.color as string || '#ffedc3';

  // Get main product quantity directly from cart items
  const mainProductQuantity = firstVariant ? 
    cart?.items?.find(item => item.variant_id === firstVariant.id)?.quantity || 0 : 0;

  return (
    <>
      <Suspense fallback={<Skeleton height={1000} />}>
        <div className="w-[100%] flex flex-col lg:flex-row">
          {/* Sidebar - product details */}
          <div className="w-full h-auto">
            <div className="p-4 md:p-8 flex flex-col gap-6 md:gap-8 h-full overflow-y-auto">
              <div className="flex justify-center items-center">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Product Details</h1>
              </div>
              
              {/* Product info */}
              <MainProductInfo 
                product={product}
                displayPrice={displayPrice}
                originalPrice={originalPrice}
                hasDiscount={hasDiscount}
                isOutOfStock={isOutOfStock}
                ingredients={ingredients}
                allergens={allergens}
                nutritionalInfo={nutritionalInfo}
                storageInstructions={storageInstructions}
                shelfLife={shelfLife}
                additionalInfo={additionalInfo}
                onOpenDetailsModal={() => setIsDetailsModalOpen(true)}
              />
              
              {/* Main Product Section */}
              <MainProductCTA 
                product={product}
                firstVariant={firstVariant}
                displayPrice={displayPrice}
                originalPrice={originalPrice}
                hasDiscount={hasDiscount}
                backgroundColor={backgroundColor}
                mainProductQuantity={mainProductQuantity}
              />

              {/* Additional Products (Flavours) Section */}
              <AdditionalProductsSection 
                additionalProducts={additionalProducts}
                cartItems={cart?.items || []}
              />

              {/* Cart Summary Section */}
              <CartSummarySection 
                product={product}
                additionalProducts={additionalProducts}
                cartItems={cart?.items || []}
              />

              {/* Action Buttons */}
              <ActionButtonsSection 
                cartItems={cart?.items || []}
              />

            </div>
          </div>
        </div>
      </Suspense>
      
      {/* Product Details Modal */}
      {isDetailsModalOpen && (
        <ProductDetailsModal 
          data={{
            title: product.title,
            description: product.description || '',
            ingredients: ingredients || '',
            allergens: allergens || '',
            nutritional_info: nutritionalInfo || {},
            storage_instructions: storageInstructions || '',
            shelf_life: shelfLife || '',
            additional_info: additionalInfo || {},
            flavour_name: product.title
          }} 
          isOpen={isDetailsModalOpen} 
          onClose={() => setIsDetailsModalOpen(false)} 
        />
      )}
    </>
  )
}