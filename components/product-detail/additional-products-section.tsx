"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { MedusaProduct } from "@/services/product-service"
import QuantityControls from "./quantity-controls"
import { useCart } from "@/services/cart-service"

interface AdditionalProductsSectionProps {
  additionalProducts: MedusaProduct[];
  cartItems: any[];
}

export default function AdditionalProductsSection({
  additionalProducts,
  cartItems
}: AdditionalProductsSectionProps) {
  const { formatPrice } = useCart();
  
  if (additionalProducts.length === 0) return null;
  
  return (
    <div className="mt-8">
      <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900">Additional Flavours</h3>
        <div className="space-y-3">
          {additionalProducts.map((additionalProduct) => {
            const additionalVariant = additionalProduct.variants && additionalProduct.variants.length > 0 
              ? additionalProduct.variants[0] 
              : null;
            const additionalPrice = additionalVariant?.calculated_price?.calculated_amount || 0;
            const additionalOriginalPrice = additionalVariant?.calculated_price?.original_amount || 0;
            const additionalHasDiscount = additionalOriginalPrice && additionalOriginalPrice > additionalPrice;
            const additionalBackgroundColor = additionalProduct.metadata?.color as string || '#ffedc3';
            const isOutOfStock = additionalVariant?.inventory_quantity === 0;

            // Check if this product is in the cart
            const additionalCartItem = additionalVariant ? 
              cartItems.find(item => 
                (item.product_id === additionalProduct.id && item.variant_id === additionalVariant.id) ||
                item.id === additionalVariant.id
              ) : null;
            const additionalQuantity = additionalCartItem ? additionalCartItem.quantity : 0;

            return (
              <div 
                key={additionalProduct.id} 
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* Additional product image */}
                  <div 
                    className="w-18 h-18 rounded-lg flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: additionalBackgroundColor }}
                  >
                    <div className="w-[100%] h-[100%] relative">
                      <Image
                        src={additionalProduct.thumbnail || ''}
                        alt={additionalProduct.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-base text-gray-900 capitalize">{additionalProduct.title}</span>
                    {additionalVariant && (
                      <span className="text-sm text-gray-600 capitalize">
                        {additionalVariant.title}
                      </span>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-gray-900">
                        {formatPrice(additionalPrice)}
                      </span>
                      {additionalHasDiscount && (
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(additionalOriginalPrice!)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {additionalVariant && (
                    isOutOfStock ? (
                      <div className="text-sm font-semibold text-red-600">Out of Stock</div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <QuantityControls 
                          variant={additionalVariant}
                          quantity={additionalQuantity}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
    </div>
  );
}