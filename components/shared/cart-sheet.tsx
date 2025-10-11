
"use client"

import type React from "react"

import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCart } from "@/services/cart-service"

export function CartSheet({ 
  children, 
  open, 
  onOpenChange 
}: { 
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { cart, loading, removeItem, updateItem, formatPrice } = useCart()
  const router = useRouter()
  
  // Cast cart to any since this component uses the full Medusa cart structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fullCart = cart as any;
  
  // Calculate total quantity
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalQuantity = fullCart?.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0

  // Get background color for product image
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getProductBackgroundColor = (item: any) => {
    if (item.product?.metadata?.color) {
      return item.product.metadata.color as string
    }
    return '#ffedc3' // Default background color
  }

  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:w-md bg-white flex flex-col h-full border-none">
        {/* Header with proper spacing to avoid close button overlap */}
        <SheetHeader className="px-4 pt-4 pb-2 pr-12 border border-gray-200">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Your Cart
            </div>
          </SheetTitle>
          <SheetDescription>
            {!fullCart?.items?.length 
              ? "Your cart is empty." 
              : `${totalQuantity} total item${totalQuantity !== 1 ? 's' : ''} in your cart`
            }
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable cart items area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading ? (
            <div className="flex h-full min-h-[200px] items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFC020]"></div>
            </div>
          ) : !fullCart?.items?.length ? (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center">
              <div className="text-center max-w-sm">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Add items to your cart to see them here.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/shop'}
                  className="rounded-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {fullCart.items.map((item: any) => {
                const backgroundColor = getProductBackgroundColor(item)
                
                return (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    {/* Product Row: Image + Details + Price */}
                    <div className="flex items-start gap-4 mb-4">
                      {/* Product Image */}
                      <div 
                        className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg flex items-center justify-center"
                        style={{ backgroundColor }}
                      >
                        <div className="relative h-14 w-14">
                          <Image
                            src={item.thumbnail || ""}
                            alt={item.title || "Product"}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base leading-tight text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        {item.variant?.title && item.variant.title !== "Default Variant" && (
                          <p className="text-sm text-gray-600 mb-2">{item.variant.title}</p>
                        )}
                        
                        {/* Price Information */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-semibold text-gray-900">
                            {formatPrice(item.unit_price)}
                          </span>
                          {item.original_total && item.original_total > item.total && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(item.original_total)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Subtotal: {formatPrice(item.total)}
                        </p>
                      </div>
                    </div>

                    {/* Actions Row: Quantity Controls + Remove */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 mr-2">Qty:</span>
                        <div className="flex items-center border border-gray-200 rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-50 rounded-none border-r border-gray-200"
                            onClick={() => updateItem(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          
                          <span className="px-3 py-1 text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-50 rounded-none border-l border-gray-200"
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>
                      </div>
                      
                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Fixed Footer with Total and Checkout */}
        { totalQuantity > 0 && (
          <SheetFooter className="px-4 py-4 border-t border-gray-200">
            <div className="w-full space-y-4">
              {/* Order Summary */}
              <div className="bg-white rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({totalQuantity} {totalQuantity > 1 ? 'items' : 'item'})</span>
                  <span className="font-medium text-gray-900">{formatPrice(fullCart?.item_subtotal)}</span>
                </div>
                {(fullCart?.shipping_total ?? 0) > 0 ? (
                  <>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span>{formatPrice(fullCart?.shipping_total)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-gray-900">{formatPrice(cart?.total)}</span>
                      </div>
                    </div>
                  </>
                ) : null}
                {/* <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">{formatPrice(cart?.total)}</span>
                  </div>
                </div> */}
              </div>

              {/* Minimum Order Notice */}
              {totalQuantity < Number(process.env.NEXT_PUBLIC_MINIMUM_QUANTITY) && (
                <div className="bg-gray-200 border border-gray-200 rounded-lg px-3 py-5">
                  <p className="text-sm text-gray-800 text-center">
                    Please select {Number(process.env.NEXT_PUBLIC_MINIMUM_QUANTITY) - totalQuantity} more item{Number(process.env.NEXT_PUBLIC_MINIMUM_QUANTITY) - totalQuantity !== 1 ? 's' : ''} to proceed to checkout
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <Button
                onClick={() => {
                  if (totalQuantity >= Number(process.env.NEXT_PUBLIC_MINIMUM_QUANTITY)) {
                    router.push("/checkout");
                  } else {
                    toast.info("Please select at least 3 items before proceeding to checkout.");
                  }
                }}
                disabled={totalQuantity < Number(process.env.NEXT_PUBLIC_MINIMUM_QUANTITY)}
                className="w-full h-12 text-base font-semibold bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] border-2 border-[#FFD56A] rounded-full shadow-inner shadow-black/25 disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#F3C03F]/90 hover:to-[#FFBA0A]/90 active:scale-95 transition-all"
              >
                Proceed to Checkout
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
