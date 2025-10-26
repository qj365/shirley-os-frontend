/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCartStore } from '@/stores/cart-store';
import { useCheckout } from '@stripe/react-stripe-js/checkout';
import { useState } from 'react';

type Props = {
  isDisabled?: boolean;
};

const PayButton = ({ isDisabled }: Props) => {
  const checkoutState = useCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const { clearCart } = useCartStore();
  const handleClick = () => {
    setLoading(true);
    if (checkoutState.type === 'success') {
      const { confirm } = checkoutState.checkout;

      confirm().then(result => {
        if (result.type === 'success') {
          clearCart();
        }
        if (result.type === 'error') {
          setError(result.error);
        }
        setLoading(false);
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-10">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || isDisabled}
        className="flex min-w-50 items-center gap-2 rounded-full border-2 border-[#FFD56A] bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] px-8 py-2 !text-center text-base font-semibold shadow-inner shadow-black/25 transition-all hover:from-[#F3C03F]/90 hover:to-[#FFBA0A]/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
            Processing...
          </>
        ) : (
          <span className="w-full text-center">Pay</span>
        )}
      </button>
      {error && <div className="text-red-500">{error.message}</div>}
    </div>
  );
};

export default PayButton;
