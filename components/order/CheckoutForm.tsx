'use client';

import {
  validateEmail,
  validatePhoneNumber,
  validatePostalCode,
} from '@/lib/checkout-validation';
import { api } from '@/src/lib/api/customer';
import type { CreateCheckoutSessionDto } from '@/src/lib/api/customer/client/models/CreateCheckoutSessionDto';
import { useAuthStore } from '@/stores/auth-store';
import {
  SUBSCRIPTION_FREQUENCIES,
  type SubscriptionFrequency,
  useCartStore,
} from '@/stores/cart-store';
import { toastErrorMessage } from '@/utils/helpers/toastErrorMessage';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import BillingInfoFormStep from './BillingInfoFormStep';
import EmailInfoFormStep from './EmailInfoFormStep';
import PaymentInfoFormStep from './PaymentInfoFormStep';
import ShippingInfoFormStep from './ShippingInfoFormStep';

// Initialize Stripe

export interface AddressFormData {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  province: string;
  country: string;
  postal_code: string;
  phone: string;
  note?: string;
}

export interface ValidationErrors {
  email?: string;
  shipping_phone?: string;
  shipping_postal?: string;
  billing_postal?: string;
}

interface Props {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export const CheckoutForm: React.FC<Props> = ({
  currentStep,
  setCurrentStep,
}) => {
  const { items } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  // Check if cart is empty
  const isCartEmpty = items.length === 0;

  // Form states
  const [email, setEmail] = useState('');

  // Auto-fill email if user is logged in
  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user, email]);

  const [shippingAddress, setShippingAddress] = useState<AddressFormData>({
    first_name: '',
    last_name: '',
    address_1: '',
    address_2: '',
    city: '',
    province: '',
    country: 'GB', // Fixed to UK only
    postal_code: '',
    phone: '',
    note: '',
  });
  const [billingAddress, setBillingAddress] = useState<AddressFormData>({
    first_name: '',
    last_name: '',
    address_1: '',
    address_2: '',
    city: '',
    province: '',
    country: 'GB', // Fixed to UK only
    postal_code: '',
    phone: '',
  });
  const [useSameForBilling, setUseSameForBilling] = useState(true);

  // Payment states
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const [isShowCheckoutForm, setIsShowCheckoutForm] = useState<boolean | null>(
    null
  );

  const getSubscriptionInterval = (
    frequency: SubscriptionFrequency | null
  ): CreateCheckoutSessionDto['items'][number]['subscriptionInterval'] =>
    frequency
      ? (`WEEKS_${frequency}` as CreateCheckoutSessionDto['items'][number]['subscriptionInterval'])
      : undefined;

  useEffect(() => {
    if (user) {
      setIsShowCheckoutForm(true);
    } else {
      setIsShowCheckoutForm(false);
    }
  }, [user]);

  // Step 0: Email validation and submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setValidationErrors({ email: emailValidation.error });
      toast.error(emailValidation.error || 'Invalid email');
      return;
    }

    setValidationErrors({});
    setCurrentStep(1);
  };

  // Step 1: Shipping address validation and submission
  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields (province is now optional for UK)
    if (
      !shippingAddress.first_name ||
      !shippingAddress.last_name ||
      !shippingAddress.address_1 ||
      !shippingAddress.city ||
      !shippingAddress.postal_code ||
      !shippingAddress.phone
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate phone number
    const phoneValidation = validatePhoneNumber(
      shippingAddress.phone,
      shippingAddress.country
    );
    if (!phoneValidation.isValid) {
      setValidationErrors({ shipping_phone: phoneValidation.error });
      toast.error(phoneValidation.error || 'Invalid phone number');
      return;
    }

    // Validate postal code
    const postalValidation = validatePostalCode(
      shippingAddress.postal_code,
      shippingAddress.country
    );
    if (!postalValidation.isValid) {
      setValidationErrors({ shipping_postal: postalValidation.error });
      toast.error(postalValidation.error || 'Invalid postal code');
      return;
    }

    setValidationErrors({});
    setCurrentStep(2);
  };

  // Step 2: Billing address validation and submission
  const handleBillingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!useSameForBilling) {
      // Validate billing address if different from shipping
      if (
        !billingAddress.first_name ||
        !billingAddress.last_name ||
        !billingAddress.address_1 ||
        !billingAddress.city ||
        !billingAddress.postal_code
      ) {
        toast.error('Please fill in all required billing fields');
        return;
      }

      const postalValidation = validatePostalCode(
        billingAddress.postal_code,
        billingAddress.country
      );
      if (!postalValidation.isValid) {
        setValidationErrors({ billing_postal: postalValidation.error });
        toast.error(postalValidation.error || 'Invalid postal code');
        return;
      }
    }

    setValidationErrors({});
    // Move to payment step and create checkout session
    await createCheckoutSession();
  };

  // Create checkout session with backend
  const createCheckoutSession = async () => {
    setIsProcessing(true);

    try {
      // Prepare request body according to CreateCheckoutSessionDto
      const requestBody: CreateCheckoutSessionDto = {
        items: items.map(item => {
          const isSubscription = item.paymentPlan === 'subscription';
          const subscriptionInterval = isSubscription
            ? getSubscriptionInterval(
                item.deliveryFrequencyWeeks ?? SUBSCRIPTION_FREQUENCIES[0]
              )
            : undefined;

          return {
            productVariantId: item.variantId,
            quantity: item.quantity,
            isSubscription,
            subscriptionInterval,
          };
        }),
        shippingInfo: {
          name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
          email: email,
          phone: shippingAddress.phone,
          address1: shippingAddress.address_1,
          address2: shippingAddress.address_2 || '',
          city: shippingAddress.city,
          province: shippingAddress.province,
          zipCode: shippingAddress.postal_code,
          country: shippingAddress.country,
          note: shippingAddress.note || '',
        },
        billingInfo: useSameForBilling
          ? undefined
          : {
              country: billingAddress.country,
              zipCode: billingAddress.postal_code,
              province: billingAddress.province,
              city: billingAddress.city,
              address2: billingAddress.address_2,
              address1: billingAddress.address_1,
            },
      };

      // Call OrderService.createCheckoutSession
      const response = await api.order.createCheckoutSession({
        requestBody,
      });

      setClientSecret(response.clientSecret);

      setCurrentStep(3);

      toast.success('Payment session created successfully');
    } catch (error) {
      toastErrorMessage(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <EmailInfoFormStep
            email={email}
            setEmail={setEmail}
            onSubmit={handleEmailSubmit}
            validationError={validationErrors.email}
            isCartEmpty={isCartEmpty}
          />
        );
      case 1:
        return (
          <ShippingInfoFormStep
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
            onSubmit={handleShippingSubmit}
            goToPreviousStep={goToPreviousStep}
            validationErrors={validationErrors}
            isCartEmpty={isCartEmpty}
          />
        );
      case 2:
        return (
          <BillingInfoFormStep
            billingAddress={billingAddress}
            setBillingAddress={setBillingAddress}
            useSameForBilling={useSameForBilling}
            setUseSameForBilling={setUseSameForBilling}
            onSubmit={handleBillingSubmit}
            goToPreviousStep={goToPreviousStep}
            isProcessing={isProcessing}
            validationErrors={validationErrors}
            isCartEmpty={isCartEmpty}
          />
        );
      case 3:
        return clientSecret ? (
          <PaymentInfoFormStep
            clientSecret={clientSecret}
            goToPreviousStep={goToPreviousStep}
            isCartEmpty={isCartEmpty}
          />
        ) : null;
      default:
        return null;
    }
  };

  const handleLoginClick = () => {
    // Save current path to redirect back after login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectAfterLogin', '/order');
      router.push('/login');
    }
  };

  const handleContinueAsGuestClick = () => {
    setIsShowCheckoutForm(true);
    setCurrentStep(0);
  };

  if (isShowCheckoutForm === null) {
    return <div className="text-center">Loading...</div>;
  }

  if (!isShowCheckoutForm && !user) {
    return (
      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="btn-gradient--yellow px-8 py-2 text-center text-base font-semibold transition-all hover:to-[#FFBA0A]/90 active:scale-95"
          onClick={handleLoginClick}
        >
          Login
        </button>
        <button
          type="button"
          className="rounded-full bg-black px-8 py-2 text-base font-semibold text-white shadow-inner shadow-black/25 transition-all hover:opacity-80 active:scale-95"
          onClick={handleContinueAsGuestClick}
        >
          Continue as guest
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress indicator */}
      {currentStep < 4 && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {['Email', 'Shipping', 'Billing', 'Payment'].map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      index < currentStep
                        ? 'bg-green-500 font-bold text-white'
                        : index === currentStep
                          ? 'bg-[#FFC020] font-bold text-black'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm ${
                      index === currentStep ? 'font-bold' : 'text-gray-500'
                    }`}
                  >
                    {step}
                  </span>
                </div>

                {index < 3 && (
                  <div
                    className={`mx-2 h-1 flex-1 ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Current step content */}
      <div className="mb-8">{renderStep()}</div>
    </div>
  );
};
