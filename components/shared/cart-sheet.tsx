'use client';

import type React from 'react';

import CartItem from '@/components/shared/cart-item';
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
import { useCartStore } from '@/stores/cart-store';
import formatDisplayCurrency from '@/utils/helpers/formatDisplayCurrency';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function CartSheet({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const router = useRouter();
  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const getTotalItems = useCartStore(state => state.getTotalItems);
  const getSubtotal = useCartStore(state => state.getSubtotal);

  const totalQuantity = getTotalItems();
  const subtotal = getSubtotal();

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
            {!items.length
              ? 'Your cart is empty.'
              : `${totalQuantity} total item${totalQuantity !== 1 ? 's' : ''} in your cart`}
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable cart items area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {!items.length ? (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center">
              <div className="max-w-sm text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <ShoppingCart className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Your cart is empty
                </h3>
                <p className="mb-6 text-sm text-gray-600">
                  Add items to your cart to see them here.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    onOpenChange?.(false);
                    router.push('/shop');
                  }}
                  className="rounded-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                  showQuantityControls={true}
                  showRemoveButton={true}
                />
              ))}
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
                    Subtotal ({totalQuantity}{' '}
                    {totalQuantity > 1 ? 'items' : 'item'})
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatDisplayCurrency(subtotal)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatDisplayCurrency(subtotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Minimum Order Notice */}
              {(() => {
                const minOrderRequired = items.some(
                  item => item.quantity < item.minOrder
                );
                const minOrderItems = items.filter(
                  item => item.quantity < item.minOrder
                );

                if (minOrderRequired) {
                  return (
                    <div className="rounded-lg border border-gray-200 bg-gray-200 px-3 py-5">
                      <p className="text-center text-sm text-gray-800">
                        {minOrderItems
                          .map(
                            item =>
                              `Please increase ${item.productName} to at least ${item.minOrder} items`
                          )
                          .join(', ')}
                      </p>
                    </div>
                  );
                }

                return null;
              })()}

              {/* Checkout Button */}
              <Button
                onClick={() => {
                  const minOrderRequired = items.some(
                    item => item.quantity < item.minOrder
                  );

                  if (minOrderRequired) {
                    const minOrderItems = items.filter(
                      item => item.quantity < item.minOrder
                    );
                    toast.info(
                      `Please increase quantities to meet minimum order requirements: ${minOrderItems.map(item => `${item.productName} (min: ${item.minOrder})`).join(', ')}`
                    );
                    return;
                  }

                  onOpenChange?.(false);
                  router.push('/order');
                }}
                disabled={items.some(item => item.quantity < item.minOrder)}
                className="h-12 w-full rounded-full border-2 border-[#FFD56A] bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] text-base font-semibold shadow-inner shadow-black/25 transition-all hover:from-[#F3C03F]/90 hover:to-[#FFBA0A]/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Proceed to Order
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
