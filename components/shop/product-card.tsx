"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartSheet } from "@/components/shared/cart-sheet";
import { MedusaProduct } from "@/services/product-service";
import { useCart } from "@/services/cart-service";

interface ProductCardProps {
  product: MedusaProduct;
  categoryId: string | null;
}

export default function ProductCard({product, categoryId}: ProductCardProps) {
  // Get the primary image or first available image
  const primaryImage = product.thumbnail ? product.thumbnail : null;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addItem, formatPrice } = useCart();
  
  // Get the first variant and its price
  const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  
  // Calculate display price (in pounds)
  const minimum_quantity = 3
  const displayPrice = (firstVariant?.calculated_price?.calculated_amount || 0) * minimum_quantity
  
  // Check if product is out of stock - MODIFIED: All products are now out of stock
  const isOutOfStock = true; // Previously: firstVariant?.inventory_quantity === 0;

  // Construct product detail link
  const productDetailUrl = `/shop/product_detail?id=${product.id}&category=${categoryId}`;

  const handleAddToCart = () => {
    if (firstVariant) {
      addItem(firstVariant.id, 1);
      setIsCartOpen(true);
    }
  };

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col`}>
      <Link href={productDetailUrl} className="block">
        <div className="flex justify-center bg-[#ffedc3] rounded-t-xl aspect-[4/3] relative cursor-pointer hover:bg-[#ffd700] transition-colors">
          <Image
            src={primaryImage || ""}
            alt={product.title}
            width={400}
            height={300}
            className="w-full h-full object-contain p-4 sm:p-6 md:p-8"
            priority
          />
          {isOutOfStock && (
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className={`p-3 sm:p-4 md:p-6 flex flex-col flex-grow ${isOutOfStock ? 'opacity-50' : ''}`}>
        <h3 className="text-base sm:text-base font-semibold mb-2 line-clamp-2">{product.title}</h3>
        
        {/* Product details */}
        <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:gap-2">
            <Image src="/image/icon1.png" alt="icon1" width={14} height={14} className="w-3 h-3 sm:w-4 sm:h-4"/>
            {firstVariant?.title}
          </p>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{product.description}</p>

        <div className="flex items-center mb-3 sm:mb-4">
          <span className="text-base sm:text-lg font-bold text-black">
            From {formatPrice(displayPrice)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full px-1 py-2 bg-black text-white text-sm rounded-full active:scale-95 transition capitalize disabled:bg-gray-400 disabled:cursor-not-allowed">
              Add to cart
            </button>
          </CartSheet>

          <Link href={productDetailUrl} className="w-full">
            <button 
              className="w-full px-1 py-2 border border-black text-black text-sm rounded-full active:scale-95 hover:bg-black hover:text-white transition capitalize">
              View Product
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}