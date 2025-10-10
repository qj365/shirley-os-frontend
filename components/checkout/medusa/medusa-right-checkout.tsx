"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

import { useCart } from "@/services/cart-service"
import Loading from "@/components/shared/loading"

interface MedusaRightCheckoutProps {
  showSummary?: boolean
}

export default function MedusaRightCheckout({
  showSummary = false,
}: MedusaRightCheckoutProps = {}) {
  // Get cart from Medusa cart service
  const {
    cart,
    loading,
    formatPrice,
    handleAddToCart,
    handleDecreaseQuantity,
    removeItem,
  } = useCart()
  const [isLoading, setIsLoading] = useState(true)

  // Determine which items to display based on payment intent status
  const itemsToDisplay = cart?.items || []

  // Check if cart is empty
  const isCartEmpty = itemsToDisplay.length === 0

  useEffect(() => {
    // Once cart is loaded, set loading to false
    if (!loading) {
      setIsLoading(false)
    }
  }, [loading])
  
  if (isLoading) {
    return <Loading />
  }




  // Add a function to remove items from cart
  const handleRemoveFromCart = (lineId: string) => {
    console.log("Removing item with ID:", lineId);
    // a small delay to ensure the event has fully propagated
    setTimeout(() => {
      removeItem(lineId);
      toast.success("Item removed", {
        description: "Item has been removed from your cart",
      });
    }, 10);
  }

  // Get product image from Medusa cart item
  const getProductImage = (item: any) => {
    // For Medusa cart items
    if (item.thumbnail) {
      return item.thumbnail;
    }
    
    // For items with images array (from orderItems)
    if (item.images && item.images.length > 0) {
      const primaryImage = item.images.find((img: any) => img.is_primary) || item.images[0]
      return primaryImage.url
    }
    
    return `/placeholder.svg?height=180&width=150&query=${item.title || item.name} product`
  }

  // Render the editable cart view
  const renderEditableCartView = () => {
    return (
      <>
        {/* Cart Items Section with Heading */}
        <div className="mb-6 max-h-[600px] overflow-y-auto space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">Order Summary</h3>
          <div className="space-y-4">
            {itemsToDisplay.map((item) => {
              const productImage = getProductImage(item);
              const itemTitle = item.title || "";
              const itemVariantTitle = item.variant?.title || item.subtitle || "";
              const itemId = item.id;
              const itemQuantity = item.quantity;
              
              // Get background color based on flavor
              const backgroundColor = (item.product?.metadata?.color as string) || '#6b7280';
              
              return (
                <div key={itemId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="flex p-4 relative">
                    {/* Product Image with dynamic background color and fixed height */}
                    <div 
                      className="w-[25%] rounded-lg flex items-center justify-center p-2 h-10 md:h-auto"
                      style={{ backgroundColor }}
                    >
                      <div className="relative">
                        <Image
                          src={productImage}
                          alt={itemTitle}
                          width={120}
                          height={120}
                          className="object-contain relative z-10"
                        />
                      </div>
                    </div>
                    
                    {/* Product Details (Middle section) */}
                    <div className="flex-1 pl-4 pr-10"> 
                      <h4 className="text-sm md:text-base font-semibold text-gray-900">{itemTitle}</h4>
                      {itemVariantTitle && (
                        <div className="text-sm text-gray-600 mt-1">{itemVariantTitle} Flavour</div>
                      )}
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {formatPrice(item.unit_price)}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="md:flex items-center gap-1 mt-3">
                        <div className="flex items-center gap-1 mb-2 md:mb-0">
                          <button
                            type="button"
                            className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                            onClick={() => handleDecreaseQuantity(itemId)}
                            disabled={itemQuantity <= 1}
                          >
                            <Image 
                              src="/image/shop/icon_minus_filled.png" 
                              alt="Decrease quantity" 
                              width={16} 
                              height={16} 
                            />
                          </button>
                          <span className="text-base font-bold w-3 md:w-8 text-center">
                            {itemQuantity.toString()}
                          </span>
                          <button
                            type="button"
                            className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                            onClick={() => {
                              if (item.variant_id) {
                                handleAddToCart(item.variant_id);
                              }
                            }}
                          >
                            <Image 
                              src="/image/shop/icon_plus_filled.png"
                              alt="Increase quantity" 
                              width={16} 
                              height={16} 
                            />
                          </button>
                        </div>
                        <div className="ml-auto text-sm md:text-base md:font-semibold text-gray-900">
                          Total: {formatPrice(item.total)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Close Button */}
                    <div 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveFromCart(itemId);
                      }}
                      className="absolute top-4 right-4 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-gray-300 transition-colors cursor-pointer"
                    >
                      <span className="text-base font-bold">×</span>
                      <span className="sr-only">Remove</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-300 pt-6 mt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-lg">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold text-gray-900">{formatPrice(cart?.item_subtotal)}</span>
            </div>
            
            {/* Always show discount as £0.00 */}
            <div className="flex justify-between text-lg text-gray-600">
              <span>Discount:</span>
              <span className="font-semibold">£0.00</span>
            </div>

            {/* <div className="flex justify-between text-lg text-gray-600">
              <span>Shipping:</span>
              <span className="font-semibold">{formatPrice(cart?.shipping_total)}</span>
            </div>
            <div className="flex justify-between text-lg md:text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span>{formatPrice(cart?.total)}</span>
            </div> */}
          
          {(cart?.shipping_total ?? 0) > 0 ? (
                  <>
                    <div className="flex justify-between text-lg text-gray-600">
                      <span>Shipping</span>
                      <span>{formatPrice(cart?.shipping_total)}</span>
                    </div>
                    <div className="flex justify-between text-lg md:text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total:</span>
                      <span>{formatPrice(cart?.total)}</span>
                    </div>
                  </>
                ) : null}
          
          </div>
        </div>

        {/* Discount Code Section - Kept as UI placeholder */}
        <div className="bg-[#F2F2F2] rounded-lg mt-6">
          <h3 className="font-semibold text-lg mb-4">Discount Code</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-white border-2 rounded-lg overflow-hidden transition-colors border-gray-300">
              <input
                type="text"
                placeholder="Enter discount code"
                value=""
                className="w-full px-4 py-3 text-lg focus:outline-none"
              />
            </div>

            <button
              disabled
              className="bg-[#FFC020] hover:bg-[#FFB000] text-black px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Apply
            </button>
          </div>

        </div>
      </>
    );
  };

  // Render the read-only cart view (for payment mode)
  const renderReadOnlyCartView = () => {
    return (
      <>
        {/* Cart Items Section with Heading */}
        <div className="mb-6 max-h-[600px] overflow-y-auto space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">Order Summary</h3>
          
          <div className="space-y-4">
            {itemsToDisplay.map((item) => {
              const productImage = getProductImage(item);
              const itemTitle = item.title || "";
              const itemVariantTitle = item.variant?.title || item.subtitle || "";
              const itemId = item.id;
              const itemQuantity = item.quantity;
              
              const backgroundColor = (item.product?.metadata?.color as string) || '#6b7280';
              
              return (
                <div key={itemId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="flex p-4 relative">
                    <div 
                      className="w-[25%] rounded-lg flex items-center justify-center p-2 h-10 md:h-auto"
                      style={{ backgroundColor }}
                    >
                      <div className="relative">
                        <Image
                          src={productImage}
                          alt={itemTitle}
                          width={120}
                          height={120}
                          className="object-contain relative z-10"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 pl-4"> 
                      <h4 className="text-sm md:text-base font-semibold text-gray-900">{itemTitle}</h4>
                      {itemVariantTitle && (
                        <div className="text-sm text-gray-600 mt-1">{itemVariantTitle} Flavour</div>
                      )}
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {formatPrice(item.unit_price)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Quantity: {itemQuantity}
                      </div>
                      <div className="ml-auto text-sm md:text-base md:font-semibold text-gray-900">
                          Total: {formatPrice(item.total)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-300 pt-6 mt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-lg">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold text-gray-900">{formatPrice(cart?.item_subtotal)}</span>
            </div>
            
            <div className="flex justify-between text-lg text-gray-600">
              <span>Discount:</span>
              <span className="font-semibold">£0.00</span>
            </div>

            <div className="flex justify-between text-lg text-gray-600">
              <span>Shipping:</span>
              <span className="font-semibold">{formatPrice(cart?.shipping_total)}</span>
            </div>
            
            <div className="flex justify-between text-lg md:text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span>{formatPrice(cart?.total)}</span>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="w-full">
      {/* Make the order summary sticky on larger screens */}
      <div className="lg:sticky">
        {/* Empty Cart Message */}
        {!isLoading && isCartEmpty && (
          <div className="text-center p-6">
            <div className="bg-[#FFEDC3] p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <p className="mb-6">Add some products to your cart to proceed with checkout.</p>
              <Link href="/shop">
                <button className="bg-gradient-to-r from-[#F3C03F] to-[#FFBA0A] px-6 py-3 rounded-full font-semibold">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Main Order Summary Container */}
        {!isCartEmpty && (
          <div className="bg-[#F2F2F2] rounded-lg p-6 md:p-8 mb-6">
            <div className="flex flex-col gap-6">
              {showSummary
                ? renderReadOnlyCartView()
                : renderEditableCartView()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}