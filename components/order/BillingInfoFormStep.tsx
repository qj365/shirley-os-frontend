'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AddressFormData, ValidationErrors } from './CheckoutForm';

// Billing Step Component
interface BillingStepProps {
  billingAddress: AddressFormData;
  setBillingAddress: (address: AddressFormData) => void;
  useSameForBilling: boolean;
  setUseSameForBilling: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  goToPreviousStep: () => void;
  isProcessing: boolean;
  validationErrors: ValidationErrors;
  isCartEmpty: boolean;
}

const BillingInfoFormStep: React.FC<BillingStepProps> = ({
  billingAddress,
  setBillingAddress,
  useSameForBilling,
  setUseSameForBilling,
  onSubmit,
  goToPreviousStep,
  isProcessing,
  validationErrors,
  isCartEmpty,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBillingAddress({ ...billingAddress, [name]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Billing Information</h2>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Checkbox to use same as shipping */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="useSameForBilling"
            checked={useSameForBilling}
            onChange={e => setUseSameForBilling(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300"
          />
          <label
            htmlFor="useSameForBilling"
            className="text-base text-gray-700"
          >
            Same as shipping address
          </label>
        </div>

        {!useSameForBilling && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="rounded border-2 border-[#797979] p-2">
                <input
                  type="text"
                  name="first_name"
                  value={billingAddress.first_name}
                  onChange={handleChange}
                  className="w-full bg-transparent text-base font-semibold text-black outline-none placeholder:text-[#797979]"
                  placeholder="First name"
                  required
                />
              </div>
            </div>

            <div>
              <div className="rounded border-2 border-[#797979] p-2">
                <input
                  type="text"
                  name="last_name"
                  value={billingAddress.last_name}
                  onChange={handleChange}
                  className="w-full bg-transparent text-base font-semibold text-black outline-none placeholder:text-[#797979]"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="rounded border-2 border-[#797979] p-2">
                <input
                  type="text"
                  name="address_1"
                  value={billingAddress.address_1}
                  onChange={handleChange}
                  className="w-full bg-transparent text-base font-semibold text-black outline-none placeholder:text-[#797979]"
                  placeholder="Address"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="rounded border-2 border-[#797979] p-2">
                <input
                  type="text"
                  name="address_2"
                  value={billingAddress.address_2}
                  onChange={handleChange}
                  className="w-full bg-transparent text-base font-semibold text-black outline-none placeholder:text-[#797979]"
                  placeholder="Apartment, suite, etc. (optional)"
                />
              </div>
            </div>

            <div>
              <div className="rounded border-2 border-[#797979] p-2">
                <input
                  type="text"
                  name="city"
                  value={billingAddress.city}
                  onChange={handleChange}
                  className="w-full bg-transparent text-base font-semibold text-black outline-none placeholder:text-[#797979]"
                  placeholder="City"
                  required
                />
              </div>
            </div>

            <div>
              <div className="rounded border-2 border-[#797979] p-2">
                <input
                  type="text"
                  name="province"
                  value={billingAddress.province}
                  onChange={handleChange}
                  className="w-full bg-transparent text-base font-semibold text-black outline-none placeholder:text-[#797979]"
                  placeholder="Province"
                />
              </div>
            </div>

            <div>
              <div
                className={`border-2 ${validationErrors.billing_postal ? 'border-red-500' : 'border-[#797979]'} rounded p-2`}
              >
                <input
                  type="text"
                  name="postal_code"
                  value={billingAddress.postal_code}
                  onChange={handleChange}
                  className="w-full bg-transparent text-base font-semibold text-black outline-none placeholder:text-[#797979]"
                  placeholder="Postal code"
                  required
                />
              </div>
              {validationErrors.billing_postal && (
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.billing_postal}
                </p>
              )}
            </div>

            <div>
              <div className="rounded border-2 border-gray-300 bg-gray-50 p-2">
                <input
                  type="text"
                  value="United Kingdom"
                  disabled
                  className="w-full bg-transparent text-base font-semibold text-gray-700 outline-none"
                />
                <input type="hidden" name="country" value="GB" />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Currently shipping to UK only
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={isProcessing}
            className="flex items-center gap-2 rounded-full bg-gray-200 px-6 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <button
            type="submit"
            disabled={isProcessing || isCartEmpty}
            className="flex items-center gap-2 rounded-full border-2 border-[#FFD56A] bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] px-8 py-2 text-base font-semibold shadow-inner shadow-black/25 transition-all hover:from-[#F3C03F]/90 hover:to-[#FFBA0A]/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                Continue to Payment
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillingInfoFormStep;
