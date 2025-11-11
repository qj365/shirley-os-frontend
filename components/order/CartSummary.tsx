'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import Loading from '@/components/shared/loading';
import CartItem from '@/components/shared/cart-item';
import { useCartStore } from '@/stores/cart-store';
import formatDisplayCurrency from '@/utils/helpers/formatDisplayCurrency';
import { SHIPPING_FEE } from '@/utils/constants';

interface Props {
  showSummary?: boolean;
}

export default function CartSummary({ showSummary = false }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  // Get cart data from store
  const items = useCartStore(state => state.items);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  const updateItemPayment = useCartStore(state => state.updateItemPayment);
  const getSubtotal = useCartStore(state => state.getSubtotal);

  // Check if cart is empty
  const isCartEmpty = items.length === 0;
  const subtotal = getSubtotal();

  useEffect(() => {
    // Simulate loading for consistency with original design
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  // Render the editable cart view
  const renderEditableCartView = () => {
    return (
      <>
        {/* Cart Items Section with Heading */}
        <div className="mb-6 max-h-[600px] space-y-4 overflow-y-auto">
          <h3 className="mb-5 text-lg font-semibold text-gray-900">
            Order Summary
          </h3>
          <div className="space-y-4">
            {items.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                showQuantityControls={true}
                showRemoveButton={true}
                showShortContent={true}
                onUpdatePayment={updateItemPayment}
              />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-6 border-t border-gray-300 pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-lg">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold text-gray-900">
                {formatDisplayCurrency(subtotal)}
              </span>
            </div>

            <div className="flex justify-between text-lg">
              <span className="text-gray-700">Shipping Fee:</span>
              <span className="font-semibold text-gray-900">
                {formatDisplayCurrency(SHIPPING_FEE)}
              </span>
            </div>

            <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold text-gray-900 md:text-xl">
              <span>Total:</span>
              <span>{formatDisplayCurrency(subtotal + SHIPPING_FEE)}</span>
            </div>
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
        <div className="mb-6 max-h-[600px] space-y-4 overflow-y-auto">
          <h3 className="mb-5 text-lg font-semibold text-gray-900">
            Order Summary
          </h3>

          <div className="space-y-4">
            {items.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                showQuantityControls={false}
                showRemoveButton={false}
                showPaymentOption={false}
                showShortContent={true}
                onUpdatePayment={undefined}
              />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-6 border-t border-gray-300 pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-lg">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold text-gray-900">
                {formatDisplayCurrency(subtotal)}
              </span>
            </div>

            <div className="flex justify-between text-lg">
              <span className="text-gray-700">Shipping Fee:</span>
              <span className="font-semibold text-gray-900">
                {formatDisplayCurrency(SHIPPING_FEE)}
              </span>
            </div>

            <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold text-gray-900 md:text-xl">
              <span>Total:</span>
              <span>{formatDisplayCurrency(subtotal + SHIPPING_FEE)}</span>
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
          <div className="p-6 text-center">
            <div className="rounded-lg bg-[#FFEDC3] p-6">
              <h2 className="mb-4 text-2xl font-bold">Your cart is empty</h2>
              <p className="mb-6">
                Add some products to your cart to proceed with checkout.
              </p>
              <Link href="/shop">
                <button className="rounded-full bg-gradient-to-r from-[#F3C03F] to-[#FFBA0A] px-6 py-3 font-semibold">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Main Order Summary Container */}
        {!isCartEmpty && (
          <div className="mb-6 rounded-lg bg-[#F2F2F2] p-6 md:p-8">
            <div className="flex flex-col gap-6">
              {showSummary
                ? renderReadOnlyCartView()
                : renderEditableCartView()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
