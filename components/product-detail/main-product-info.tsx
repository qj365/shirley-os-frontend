"use client"

import { MedusaProduct } from "@/services/product-service"

interface ProductInfoProps {
  product: MedusaProduct;
  displayPrice: number;
  originalPrice: number | undefined;
  hasDiscount: boolean;
  isOutOfStock: boolean;
  ingredients?: string;
  allergens?: string;
  nutritionalInfo?: string | Record<string, any>;
  storageInstructions?: string;
  shelfLife?: string;
  additionalInfo?: string | Record<string, any>;
  onOpenDetailsModal: () => void;
}

export default function MainProductInfo({
  product,
  displayPrice,
  originalPrice,
  hasDiscount,
  isOutOfStock,
  ingredients,
  allergens,
  nutritionalInfo,
  storageInstructions,
  shelfLife,
  additionalInfo,
  onOpenDetailsModal
}: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-3 md:gap-4">
        <h2 className="text-xl md:text-xl lg:text-2xl font-bold capitalize">{product.title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xl md:text-xl lg:text-2xl font-semibold">£{(displayPrice).toFixed(2)}</span>
          {hasDiscount && <span className="text-lg md:text-xl text-gray-500 line-through">£{(originalPrice!).toFixed(2)}</span>}
        </div>
        {isOutOfStock && <div className="text-sm font-semibold text-red-600">Out of Stock</div>}
      </div>
      <p className="text-sm md:text-base lg:text-base">
        {product.description}
      </p>
      
      {/* Add See More Details button */}
      {(ingredients || allergens || nutritionalInfo || 
        storageInstructions || shelfLife || additionalInfo) && (
        <button
          onClick={onOpenDetailsModal}
          className="text-sm font-medium text-[#FFC020] hover:text-[#E5A800] flex items-center gap-1 w-fit"
        >
          See More Details
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
}