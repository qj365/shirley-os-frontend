'use client';

import * as React from 'react';

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
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import {
  SHIPPING_FEE,
  REQUIRED_CATEGORIES_FOR_COMBO,
  PRODUCT_LIST_ITEM_COMBO,
} from '@/utils/constants';

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
  const pathname = usePathname();
  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const updateItemPayment = useCartStore(state => state.updateItemPayment);
  const getTotalItems = useCartStore(state => state.getTotalItems);
  const getSubtotal = useCartStore(state => state.getSubtotal);

  const totalQuantity = getTotalItems();
  const subtotal = getSubtotal();

  // Check if we're on the checkout page - disable cart editing if so
  const isCheckoutPage = pathname?.startsWith('/order') ?? false;

  // No-op functions to prevent cart editing on checkout page
  const handleUpdateQuantity = isCheckoutPage
    ? () => {
        // Do nothing - cart editing is disabled on checkout page
      }
    : updateQuantity;

  const handleRemoveItem = isCheckoutPage
    ? () => {
        // Do nothing - cart editing is disabled on checkout page
      }
    : removeItem;

  const handleUpdatePayment = isCheckoutPage ? undefined : updateItemPayment;

  // Check category combo requirements
  const categoryComboValidation = React.useMemo(() => {
    // Helper function to compare category names case-insensitively
    const normalizeCategoryName = (name: string) => name.toLowerCase().trim();
    const normalizedRequiredCategories = REQUIRED_CATEGORIES_FOR_COMBO.map(
      normalizeCategoryName
    );

    // Get all unique categories in cart (normalized)
    const categoriesInCart = new Set(
      items
        .map(item => item.categoryName)
        .filter(Boolean)
        .map(normalizeCategoryName)
    );

    // Find required categories that are present in cart
    const presentRequiredCategories = REQUIRED_CATEGORIES_FOR_COMBO.filter(
      category => categoriesInCart.has(normalizeCategoryName(category))
    );

    // For each required category, count the total quantity (not number of variants)
    // This allows: 1 variant with quantity 3, or multiple variants with total quantity 3
    const categoryQuantityCounts = new Map<string, number>();
    items.forEach(item => {
      if (!item.categoryName) return;
      const normalizedItemCategory = normalizeCategoryName(item.categoryName);
      if (normalizedRequiredCategories.includes(normalizedItemCategory)) {
        // Use the original required category name as key for consistency
        const matchingRequiredCategory = REQUIRED_CATEGORIES_FOR_COMBO.find(
          reqCat => normalizeCategoryName(reqCat) === normalizedItemCategory
        );
        if (matchingRequiredCategory) {
          const currentQuantity =
            categoryQuantityCounts.get(matchingRequiredCategory) || 0;
          // Sum up the quantities, not count variants
          categoryQuantityCounts.set(
            matchingRequiredCategory,
            currentQuantity + item.quantity
          );
        }
      }
    });

    // Find categories that don't meet the minimum requirement
    // Check if total quantity >= PRODUCT_LIST_ITEM_COMBO
    const insufficientCategories = presentRequiredCategories.filter(
      category => {
        const totalQuantity = categoryQuantityCounts.get(category) || 0;
        return totalQuantity < PRODUCT_LIST_ITEM_COMBO;
      }
    );

    return {
      hasInsufficientCategories: insufficientCategories.length > 0,
      insufficientCategories,
      categoryQuantityCounts,
    };
  }, [items]);

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
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  showQuantityControls={!isCheckoutPage}
                  showRemoveButton={!isCheckoutPage}
                  onUpdatePayment={handleUpdatePayment}
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
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="font-medium text-gray-900">
                    {formatDisplayCurrency(SHIPPING_FEE)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatDisplayCurrency(subtotal + SHIPPING_FEE)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Combo Requirement Notice */}
              {categoryComboValidation.hasInsufficientCategories && (
                <div className="rounded-lg border border-yellow-300 bg-yellow-50 px-3 py-5">
                  <p className="text-center text-sm text-yellow-900">
                    {categoryComboValidation.insufficientCategories
                      .map(category => {
                        const currentQuantity =
                          categoryComboValidation.categoryQuantityCounts.get(
                            category
                          ) || 0;
                        const needed =
                          PRODUCT_LIST_ITEM_COMBO - currentQuantity;
                        return `Add ${needed} more item${needed > 1 ? 's' : ''} from "${category}" category (minimum ${PRODUCT_LIST_ITEM_COMBO} items required)`;
                      })
                      .join('. ')}
                  </p>
                </div>
              )}

              {/* Per-Item Minimum Order Notice */}
              {(() => {
                const minOrder = 1;
                const minOrderRequired = items.some(
                  item => item.quantity < minOrder
                );
                const minOrderItems = items.filter(
                  item => item.quantity < minOrder
                );

                if (minOrderRequired) {
                  return (
                    <div className="rounded-lg border border-gray-200 bg-gray-200 px-3 py-5">
                      <p className="text-center text-sm text-gray-800">
                        {minOrderItems
                          .map(
                            item =>
                              `Please increase ${item.productName} to at least ${minOrder} item${minOrder > 1 ? 's' : ''}`
                          )
                          .join(', ')}
                      </p>
                    </div>
                  );
                }

                return null;
              })()}

              {/* Checkout Button */}
              {!isCheckoutPage && (
                <Button
                  onClick={() => {
                    // Check category combo requirements
                    if (categoryComboValidation.hasInsufficientCategories) {
                      const messages =
                        categoryComboValidation.insufficientCategories.map(
                          category => {
                            const currentQuantity =
                              categoryComboValidation.categoryQuantityCounts.get(
                                category
                              ) || 0;
                            const needed =
                              PRODUCT_LIST_ITEM_COMBO - currentQuantity;
                            return `Add ${needed} more item${needed > 1 ? 's' : ''} from "${category}" category (minimum ${PRODUCT_LIST_ITEM_COMBO} items required)`;
                          }
                        );
                      toast.info(messages.join('. '));
                      return;
                    }

                    const minOrder = 1;
                    const minOrderRequired = items.some(
                      item => item.quantity < minOrder
                    );

                    if (minOrderRequired) {
                      const minOrderItems = items.filter(
                        item => item.quantity < minOrder
                      );
                      toast.info(
                        `Please increase quantities to meet minimum order requirements: ${minOrderItems.map(item => `${item.productName} (min: ${minOrder})`).join(', ')}`
                      );
                      return;
                    }

                    onOpenChange?.(false);
                    router.push('/order');
                  }}
                  disabled={
                    categoryComboValidation.hasInsufficientCategories ||
                    items.some(item => item.quantity < 1)
                  }
                  className="h-12 w-full rounded-full border-2 border-[#FFD56A] bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] text-base font-semibold shadow-inner shadow-black/25 transition-all hover:from-[#F3C03F]/90 hover:to-[#FFBA0A]/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Proceed to Order
                </Button>
              )}
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
