'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AddressFormData, ValidationErrors } from './CheckoutForm';

// Shipping Step Component
interface ShippingStepProps {
  shippingAddress: AddressFormData;
  setShippingAddress: (address: AddressFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  goToPreviousStep: () => void;
  validationErrors: ValidationErrors;
  isCartEmpty: boolean;
}

const ShippingInfoFormStep: React.FC<ShippingStepProps> = ({
  shippingAddress,
  setShippingAddress,
  onSubmit,
  goToPreviousStep,
  validationErrors,
  isCartEmpty,
}) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Shipping Information</h2>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="rounded border-2 border-[#797979] p-2">
              <input
                type="text"
                name="first_name"
                value={shippingAddress.first_name}
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
                value={shippingAddress.last_name}
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
                value={shippingAddress.address_1}
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
                value={shippingAddress.address_2}
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
                value={shippingAddress.city}
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
                value={shippingAddress.province}
                onChange={handleChange}
                className="w-full bg-transparent text-base font-semibold text-black outline-none placeholder:text-[#797979]"
                placeholder="Province"
              />
            </div>
          </div>

          <div>
            <div
              className={`border-2 ${validationErrors.shipping_postal ? 'border-red-500' : 'border-[#797979]'} rounded p-2`}
            >
              <input
                type="text"
                name="postal_code"
                value={shippingAddress.postal_code}
                onChange={handleChange}
                className="w-full bg-transparent text-base font-semibold text-black outline-none placeholder:text-[#797979]"
                placeholder="Postal code"
                required
              />
            </div>
            {validationErrors.shipping_postal && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.shipping_postal}
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

          <div className="md:col-span-2">
            <div
              className={`border-2 ${validationErrors.shipping_phone ? 'border-red-500' : 'border-[#797979]'} rounded p-2`}
            >
              <input
                type="tel"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleChange}
                className="w-full bg-transparent text-base font-semibold text-black outline-none placeholder:text-[#797979]"
                placeholder="Phone number"
                required
              />
            </div>
            {validationErrors.shipping_phone && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.shipping_phone}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="rounded border-2 border-[#797979] p-2">
              <textarea
                name="note"
                value={shippingAddress.note}
                onChange={handleChange}
                className="w-full bg-transparent text-base font-semibold text-black outline-none placeholder:text-[#797979]"
                placeholder="Order notes (optional)"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={goToPreviousStep}
            className="flex items-center gap-2 rounded-full bg-gray-200 px-6 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <button
            type="submit"
            disabled={isCartEmpty}
            className="flex items-center gap-2 rounded-full border-2 border-[#FFD56A] bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] px-8 py-2 text-base font-semibold shadow-inner shadow-black/25 transition-all hover:from-[#F3C03F]/90 hover:to-[#FFBA0A]/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingInfoFormStep;
