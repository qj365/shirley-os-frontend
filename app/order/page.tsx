'use client';

import CartSummary from '@/components/order/CartSummary';
import { CheckoutForm } from '@/components/order/CheckoutForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-24 md:pt-28 lg:pt-32">
        <div className="container">
          {/* Back to Shop Link */}
          <div className="mb-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Link>
          </div>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="mt-2 text-gray-600">Complete your purchase</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-14">
            {/* Left column - Checkout form */}
            <div className="lg:col-span-7">
              <CheckoutForm
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />
            </div>

            {/* Right column - Order summary */}
            <div className="lg:col-span-5">
              <CartSummary showSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
