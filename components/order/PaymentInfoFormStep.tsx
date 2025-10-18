/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { STRIPE_PUBLISHABLE_KEY } from '@/config';
import { loadStripe } from '@stripe/stripe-js';

const stripe = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface Props {
  clientSecret: string;
  goToPreviousStep: () => void;
  isCartEmpty: boolean;
}

export default function PaymentInfoFormStep({
  clientSecret,
  goToPreviousStep,
  isCartEmpty,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Payment Information</h2>
        <button
          type="button"
          onClick={goToPreviousStep}
          className="flex items-center gap-2 rounded-full bg-gray-200 px-6 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-300"
        >
          Back
        </button>
      </div>

      {!isCartEmpty && (
        <CheckoutProvider stripe={stripe} options={{ clientSecret }}>
          <CheckoutForm />
        </CheckoutProvider>
      )}
    </div>
  );
}

import {
  CheckoutProvider,
  PaymentElement,
} from '@stripe/react-stripe-js/checkout';

const CheckoutForm = () => {
  return (
    <form>
      <PaymentElement options={{ layout: 'accordion' }} />
      <PayButton />
    </form>
  );
};

import { useCheckout } from '@stripe/react-stripe-js/checkout';
import { useState } from 'react';
import { useCartStore } from '@/stores/cart-store';

const PayButton = () => {
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
        disabled={loading}
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
