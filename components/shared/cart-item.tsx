'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CartItem as CartItemType,
  CartPaymentPlan,
  SUBSCRIPTION_FREQUENCIES,
  SubscriptionFrequency,
} from '@/stores/cart-store';
import formatDisplayCurrency from '@/utils/helpers/formatDisplayCurrency';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  showQuantityControls?: boolean;
  showRemoveButton?: boolean;
  showShortContent?: boolean;
  className?: string;
  onUpdatePayment?: (
    id: string,
    paymentPlan: CartPaymentPlan,
    deliveryFrequencyWeeks?: SubscriptionFrequency | null
  ) => void;
  showPaymentOption?: boolean;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemoveItem,
  showQuantityControls = true,
  showRemoveButton = true,
  showShortContent = false,
  className = '',
  onUpdatePayment,
  showPaymentOption = true,
}: CartItemProps) {
  const isSubscription = item.paymentPlan === 'subscription';
  const discountedUnitPrice = item.price * 0.9;
  const effectiveUnitPrice = isSubscription ? discountedUnitPrice : item.price;
  const itemTotal = effectiveUnitPrice * item.quantity;
  const strikeThroughPrice = isSubscription ? item.price : null;
  const effectivePaymentPlan: CartPaymentPlan = item.paymentPlan ?? 'one_time';
  const effectiveDeliveryFrequency =
    effectivePaymentPlan === 'subscription'
      ? (item.deliveryFrequencyWeeks ?? SUBSCRIPTION_FREQUENCIES[0])
      : null;
  const selectedDeliveryValue =
    effectivePaymentPlan === 'subscription' && effectiveDeliveryFrequency
      ? `subscription-${effectiveDeliveryFrequency}`
      : 'one_time';

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
      <div className="flex items-start gap-4">
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
                  {formatDisplayCurrency(effectiveUnitPrice)}
                </span>
                {strikeThroughPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatDisplayCurrency(strikeThroughPrice)}
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
          {!showPaymentOption && (
            <p className="text-sm text-gray-600">
              {/* Render label of option selected based on selectedDeliveryValue */}
              {selectedDeliveryValue === 'one_time'
                ? 'One-Time Purchase'
                : `Deliver every ${selectedDeliveryValue.replace('subscription-', '')} weeks`}
            </p>
          )}
        </div>
      </div>

      {/* Actions Row: Quantity Controls + Remove */}
      {(showQuantityControls || showRemoveButton || showPaymentOption) && (
        <div className="mt-2 space-y-2 border-t border-gray-100 pt-2">
          {showPaymentOption && (
            <Select
              value={selectedDeliveryValue}
              disabled={!onUpdatePayment}
              onValueChange={value => {
                if (!onUpdatePayment) return;
                if (value === 'one_time') {
                  onUpdatePayment(item.id, 'one_time', null);
                  return;
                }

                const weeksValue = Number(value.replace('subscription-', ''));
                if (!Number.isFinite(weeksValue)) {
                  return;
                }

                const frequency = weeksValue as SubscriptionFrequency;
                if (!SUBSCRIPTION_FREQUENCIES.includes(frequency)) {
                  return;
                }

                onUpdatePayment(item.id, 'subscription', frequency);
              }}
            >
              <SelectTrigger className="h-11 rounded-lg border border-gray-200 bg-white text-sm font-medium shadow-none !ring-0 !ring-offset-0">
                <SelectValue placeholder="Select delivery option" />
              </SelectTrigger>
              <SelectContent className="border-none bg-white shadow-md">
                <SelectItem value="one_time">One-Time Purchase</SelectItem>
                {SUBSCRIPTION_FREQUENCIES.map(weeks => (
                  <SelectItem
                    key={weeks}
                    value={`subscription-${weeks}`}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    Deliver every {weeks} week{weeks > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="flex items-center justify-between gap-2">
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
        </div>
      )}
    </div>
  );
}
