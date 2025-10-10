"use client"

import { MedusaProduct } from "@/services/product-service"
import { useCart } from "@/services/cart-service";

interface CartSummarySectionProps {
  product: MedusaProduct;
  cartItems: any[];
  additionalProducts?: MedusaProduct[];
}

export default function CartSummarySection({
  product,
  additionalProducts = [],
  cartItems,
}: CartSummarySectionProps) {
  
  // Filter cart items that belong to this product or any additional products
  const productCartItems = cartItems.filter(item => {
    // Check if it's a variant of the main product
    const isMainProductVariant = product.variants?.some(variant => variant.id === item.variant_id);
    
    // Check if it belongs to any of the additional products
    const isAdditionalProduct = additionalProducts.some(additionalProduct => 
      additionalProduct.variants?.some(variant => variant.id === item.variant_id)
    );
    
    return isMainProductVariant || isAdditionalProduct;
  });

  const { formatPrice } = useCart();
  
  // If no items in cart for this product, don't render anything
  if (productCartItems.length === 0) return null;
  
  // Calculate total for selected items
  const selectedItemsTotal = productCartItems.reduce((total, item) => total + item.total, 0);
  
  return (
    <div className="mt-6 border-gray-200 pt-6">
      <div className="mb-4">
        <h4 className="text-md font-semibold mb-2 text-gray-900">Selected Items:</h4>
        {productCartItems.map(item => {
          return (
            <div key={item.id} className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{item.title || product.title} x {item.quantity}</span>
              <span>{formatPrice(item.original_total ?? 0)}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center mb-4 border-t border-gray-200 pt-2">
        <span className="text-lg font-semibold">Subtotal:</span>
        <span className="text-lg font-semibold">{formatPrice(selectedItemsTotal)}</span>
      </div>
    </div>
  );
}