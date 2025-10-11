"use client"

import Image from "next/image"
import { useCart } from "@/services/cart-service"
import { ProductVariant } from "@/services/product-service"

interface QuantityControlsProps { 
  variant: ProductVariant | null,
  quantity: number
}

export default function QuantityControls({ variant, quantity }: QuantityControlsProps) {
  const { cart, handleAddToCart, handleDecreaseQuantity } = useCart()
  const isOutOfStock = true; // MODIFIED: All products are now out of stock. Previously: variant.inventory_quantity === 0;
  
  // Early return if variant is null
  if (!variant) {
    return null;
  }
  
  // Find the line item ID if this variant is already in the cart
  const findLineItemId = () => {
    if (!cart?.items) return null;
    const lineItem = cart.items.find(item => item.variant_id === variant.id);
    return lineItem?.id || null;
  }

  if (isOutOfStock) {
    return (
      <div className="text-sm font-semibold text-red-600">Out of Stock</div>
    );
  }

  if (quantity > 0) {
    return (
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 active:scale-95 rounded-lg border border-gray-200 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            const lineItemId = findLineItemId();
            if (lineItemId) handleDecreaseQuantity(lineItemId);
          }}
          aria-label={`Decrease ${variant.title} quantity`}
        >
          <Image 
            src="/image/shop/icon_minus_filled.png" 
            alt="Remove from cart" 
            width={16} 
            height={16} 
          />
        </button>
        <span className="mx-3 min-w-[24px] text-center font-medium text-gray-900">{quantity}</span>
        <button
          className="w-8 h-8 flex items-center justify-center hover:bg-[#FFC020] bg-[#FFC020]/10 active:scale-95 rounded-lg border border-[#FFC020]/20 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(variant.id);
          }}
          aria-label={`Add ${variant.title} to cart`}
          disabled={isOutOfStock}
        >
          <Image 
            src="/image/shop/icon_plus_filled.png"
            alt="Add to cart" 
            width={16} 
            height={16} 
          />
        </button>
      </div>
    );
  } else {
    return (
      <button
        className="w-8 h-8 flex items-center justify-center hover:bg-[#FFC020] bg-[#FFC020]/10 active:scale-95 rounded-lg border border-[#FFC020]/20 transition-all"
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCart(variant.id);
        }}
        aria-label={`Add ${variant.title} to cart`}
      >
        <Image 
          src="/image/shop/icon_plus_filled.png"
          alt="Add to cart" 
          width={16} 
          height={16} 
        />
      </button>
    );
  }
}