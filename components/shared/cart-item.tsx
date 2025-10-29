'use client';

import type React from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/stores/cart-store';
import formatDisplayCurrency from '@/utils/helpers/formatDisplayCurrency';
import { toast } from 'sonner';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  showQuantityControls?: boolean;
  showRemoveButton?: boolean;
  showShortContent?: boolean;
  className?: string;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemoveItem,
  showQuantityControls = true,
  showRemoveButton = true,
  showShortContent = false,
  className = '',
}: CartItemProps) {
  const itemTotal = item.price * item.quantity;

  const handleQuantityChange = (newQuantity: number) => {
    try {
      onUpdateQuantity(item.id, newQuantity);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div
      className={`rounded-lg border border-gray-200 p-4 ${className} bg-white`}
    >
      {/* Product Row: Image + Details + Price */}
      <div className="mb-4 flex items-start gap-4">
        {/* Product Image */}
        <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#ffedc3]">
          <div className="relative h-14 w-14">
            <Image
              src={item.image || ''}
              alt={item.productName || 'Product'}
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 text-base leading-tight font-semibold text-gray-900">
            {item.productName}
          </h3>
          {item.variantTitle && (
            <p className="mb-1 text-sm text-gray-600">{item.variantTitle}</p>
          )}

          {/* Price Information */}
          {!showShortContent && (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-semibold text-gray-900">
                  {formatDisplayCurrency(item.price)}
                </span>
                {item.compareAtPrice > item.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatDisplayCurrency(item.compareAtPrice)}
                  </span>
                )}
              </div>
              {item.minOrder > 1 && (
                <p className="text-xs font-medium text-gray-500">
                  Min. order: {item.minOrder} items
                </p>
              )}
            </>
          )}

          <p className="mt-1 text-sm text-gray-600">
            {!showQuantityControls && (
              <span className="mt-1 text-sm text-gray-600">
                Qty: {item.quantity}, &nbsp;
              </span>
            )}{' '}
            Subtotal: {formatDisplayCurrency(itemTotal)}
          </p>
        </div>
      </div>

      {/* Actions Row: Quantity Controls + Remove */}
      {(showQuantityControls || showRemoveButton) && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          {/* Quantity Controls */}
          {showQuantityControls && (
            <div className="flex items-center gap-2">
              <span className="mr-2 text-sm text-gray-600">Qty:</span>
              <div className="flex items-center rounded-md border border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-none border-r border-gray-200 p-0 hover:bg-gray-50"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
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
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                  <span className="sr-only">Increase quantity</span>
                </Button>
              </div>
            </div>
          )}

          {/* Remove Button */}
          {showRemoveButton && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => {
                onRemoveItem(item.id);
                toast.success('Item removed from cart');
              }}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
