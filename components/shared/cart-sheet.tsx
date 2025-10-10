'use client';

import type React from 'react';

import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCart } from '@/services/cart-service';

export function CartSheet({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { cart, loading, removeItem, updateItem, formatPrice } = useCart();
  const router = useRouter();

  // Calculate total quantity
  const totalQuantity = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Get background color for product image
  const getProductBackgroundColor = (item: any) => {
    if (item.product?.metadata?.color) {
      return item.product.metadata.color;
    }
    return '#ffedc3'; // Default background color
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex h-full w-full flex-col border-none bg-white sm:w-md">
        {/* Header with proper spacing to avoid close button overlap */}
        <SheetHeader className="border border-gray-200 px-4 pt-4 pr-12 pb-2">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Your Cart
            </div>
          </SheetTitle>
          <SheetDescription>
            {!cart?.items?.length
              ? 'Your cart is empty.'
              : `${totalQuantity} total item${totalQuantity !== 1 ? 's' : ''} in your cart`}
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable cart items area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading ? (
            <div className="flex h-full min-h-[200px] items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-[#FFC020]"></div>
            </div>
          ) : !cart?.items?.length ? (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center">
              <div className="max-w-sm text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <ShoppingCart className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Your cart is empty</h3>
                <p className="mb-6 text-sm text-gray-600">
                  Add items to your cart to see them here.
                </p>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = '/shop')}
                  className="rounded-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.items.map(item => {
                const backgroundColor = getProductBackgroundColor(item);

                return (
                  <div key={item.id} className="rounded-lg border border-gray-200 p-4">
                    {/* Product Row: Image + Details + Price */}
                    <div className="mb-4 flex items-start gap-4">
                      {/* Product Image */}
                      <div
                        className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg"
                        style={{ backgroundColor }}
                      >
                        <div className="relative h-14 w-14">
                          <Image
                            src={item.thumbnail || ''}
                            alt={item.title || 'Product'}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 text-base leading-tight font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        {item.variant?.title && item.variant.title !== 'Default Variant' && (
                          <p className="mb-2 text-sm text-gray-600">{item.variant.title}</p>
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
                        <p className="mt-1 text-sm text-gray-600">
                          Subtotal: {formatPrice(item.total)}
                        </p>
                      </div>
                    </div>

                    {/* Actions Row: Quantity Controls + Remove */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <span className="mr-2 text-sm text-gray-600">Qty:</span>
                        <div className="flex items-center rounded-md border border-gray-200">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 rounded-none border-r border-gray-200 p-0 hover:bg-gray-50"
                            onClick={() => updateItem(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>

                          <span className="min-w-[2rem] px-3 py-1 text-center text-sm font-medium text-gray-900">
                            {item.quantity}
                          </span>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 rounded-none border-l border-gray-200 p-0 hover:bg-gray-50"
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
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Fixed Footer with Total and Checkout */}
        {totalQuantity > 0 && (
          <SheetFooter className="border-t border-gray-200 px-4 py-4">
            <div className="w-full space-y-4">
              {/* Order Summary */}
              <div className="space-y-3 rounded-lg bg-white p-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    Subtotal ({totalQuantity} {totalQuantity > 1 ? 'items' : 'item'})
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(cart?.item_subtotal)}
                  </span>
                </div>
                {(cart?.shipping_total ?? 0) > 0 ? (
                  <>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span>{formatPrice(cart?.shipping_total)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(cart?.total)}
                        </span>
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
                <div className="rounded-lg border border-gray-200 bg-gray-200 px-3 py-5">
                  <p className="text-center text-sm text-gray-800">
                    Please select {Number(process.env.NEXT_PUBLIC_MINIMUM_QUANTITY) - totalQuantity}{' '}
                    more item
                    {Number(process.env.NEXT_PUBLIC_MINIMUM_QUANTITY) - totalQuantity !== 1
                      ? 's'
                      : ''}{' '}
                    to proceed to checkout
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <Button
                onClick={() => {
                  if (totalQuantity >= Number(process.env.NEXT_PUBLIC_MINIMUM_QUANTITY)) {
                    router.push('/checkout');
                  } else {
                    toast.info('Please select at least 3 items before proceeding to checkout.');
                  }
                }}
                disabled={totalQuantity < Number(process.env.NEXT_PUBLIC_MINIMUM_QUANTITY)}
                className="h-12 w-full rounded-full border-2 border-[#FFD56A] bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] text-base font-semibold shadow-inner shadow-black/25 transition-all hover:from-[#F3C03F]/90 hover:to-[#FFBA0A]/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Proceed to Checkout
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
