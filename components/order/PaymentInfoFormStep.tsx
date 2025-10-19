'use client';

import { STRIPE_PUBLISHABLE_KEY } from '@/config';
import {
  CheckoutProvider,
  PaymentElement,
} from '@stripe/react-stripe-js/checkout';
import { loadStripe } from '@stripe/stripe-js';
import PayButton from './PayButton';

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
          <form>
            <PaymentElement options={{ layout: 'accordion' }} />
            <PayButton />
          </form>
        </CheckoutProvider>
      )}
    </div>
  );
}
