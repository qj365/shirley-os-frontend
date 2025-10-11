"use client"

import Image from "next/image"
import { MedusaProduct, ProductVariant } from "@/services/product-service"
import QuantityControls from "./quantity-controls"
import { useCart } from "@/services/cart-service"

interface MainProductCtaProps {
  product: MedusaProduct;
  firstVariant: ProductVariant | null;
  displayPrice: number;
  originalPrice: number | undefined;
  hasDiscount: boolean;
  backgroundColor: string;
  mainProductQuantity: number;
}

export default function MainProductCTA({
  product,
  firstVariant,
  displayPrice,
  originalPrice,
  hasDiscount,
  backgroundColor,
  mainProductQuantity
}: MainProductCtaProps) {
  const { formatPrice } = useCart()
  
  return (
    <div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl transition-all duration-200">
          <div className="flex items-center gap-4">
            {/* Product image with colored background */}
            <div 
              className="w-18 h-18 rounded-lg flex items-center justify-center overflow-hidden"
              style={{ backgroundColor }}
            >
              <div className="w-[100%] h-[100%] relative">
                <Image
                  src={product.thumbnail || ''}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-base text-gray-900 capitalize">{product.title}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-medium text-gray-900">
                  {formatPrice(displayPrice)}
                </span>
                {hasDiscount && originalPrice && (
                  <span className="text-xs text-gray-500 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Quantity controls for main variant */}
          {firstVariant && (
            <QuantityControls 
              variant={firstVariant} 
              quantity={mainProductQuantity}
            />
          )}
        </div>
      </div>
    </div>
  );
}