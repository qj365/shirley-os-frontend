import React from "react"
import { useCart } from "@/services/cart-service"
import { sdk } from "@/config"
import { ChevronDown, ChevronUp, ArrowLeft, ArrowRight } from "lucide-react"
import { validatePhoneNumber, validatePostalCode, validateCountryCode } from "@/lib/checkout-validation"
import { saveCheckoutField, loadCheckoutField } from "@/lib/checkout-storage"

interface AddressFormData {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  country_code: string
  postal_code: string
  phone?: string
  company?: string
}

interface CheckoutBillingStepProps {
  billingAddress: AddressFormData
  setBillingAddress: (address: AddressFormData) => void
  useSameForShipping: boolean
  setUseSameForShipping: (same: boolean) => void
  shippingAddress: AddressFormData
  onSubmit: () => void
  goToPreviousStep: () => void
  validationErrors?: {
    phone?: string
    postal_code?: string
    country_code?: string
    [key: string]: string | undefined
  }
}

export const CheckoutBillingStep: React.FC<CheckoutBillingStepProps> = ({
  billingAddress,
  setBillingAddress,
  useSameForShipping,
  setUseSameForShipping,
  shippingAddress,
  onSubmit,
  goToPreviousStep,
  validationErrors: propValidationErrors
}) => {
  const { cart } = useCart()
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [validationErrors, setValidationErrors] = React.useState<{
    phone?: string
    postal_code?: string
    country_code?: string
  }>({})

  // Load saved billing address data and useSameForShipping preference on component mount
  React.useEffect(() => {
    const savedBillingAddress = loadCheckoutField('billingAddress')
    const savedUseSameForBilling = loadCheckoutField('useSameForBilling')
    
    if (savedBillingAddress && Object.keys(billingAddress).every(key => !billingAddress[key as keyof AddressFormData])) {
      setBillingAddress(savedBillingAddress)
    }
    
    if (savedUseSameForBilling !== null && savedUseSameForBilling !== undefined) {
      setUseSameForShipping(savedUseSameForBilling as boolean)
    }
  }, [])

  const validateField = (name: string, value: string) => {
    let error = ''
    
    switch (name) {
      case 'phone':
        if (value.trim()) {
          const phoneValidation = validatePhoneNumber(value, billingAddress.country_code || 'US')
          if (!phoneValidation.isValid) {
            error = phoneValidation.error || 'Invalid phone number'
          }
        }
        break
      case 'postal_code':
        if (value.trim()) {
          const postalValidation = validatePostalCode(value, billingAddress.country_code || 'US')
          if (!postalValidation.isValid) {
            error = postalValidation.error || 'Invalid postal code'
          }
        }
        break
      case 'country_code':
        if (value.trim()) {
          const countryValidation = validateCountryCode(value)
          if (!countryValidation.isValid) {
            error = countryValidation.error || 'Invalid country code'
          }
        }
        break
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [name]: error || undefined
    }))
  }

  const handleBillingAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const updatedAddress = {
      ...billingAddress,
      [name]: value
    }
    setBillingAddress(updatedAddress)
    
    // Save billing address to localStorage on every change
    saveCheckoutField('billingAddress', updatedAddress)
    
    // Validate field on change
    if (['phone', 'postal_code', 'country_code'].includes(name)) {
      validateField(name, value)
    }
    
    // Re-validate postal code when country changes
    if (name === 'country_code' && billingAddress.postal_code) {
      validateField('postal_code', billingAddress.postal_code)
    }
    
    // Re-validate phone when country changes
    if (name === 'country_code' && billingAddress.phone) {
      validateField('phone', billingAddress.phone)
    }
  }

  // Handle useSameForShipping change with persistence
  const handleUseSameForShippingChange = (same: boolean) => {
    setUseSameForShipping(same)
    saveCheckoutField('useSameForBilling', same)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!cart) {
      setError("Cart not found. Please try again.")
      return
    }

    // Validate all fields before submission if not using same address
    if (!useSameForShipping) {
      const fieldsToValidate = [
        { name: 'phone', value: billingAddress.phone || '' },
        { name: 'postal_code', value: billingAddress.postal_code },
        { name: 'country_code', value: billingAddress.country_code }
      ]
      
      fieldsToValidate.forEach(field => {
        validateField(field.name, field.value)
      })
      
      // Check if there are any validation errors
      const hasErrors = Object.values(validationErrors).some(error => error)
      if (hasErrors) {
        setError("Please fix the validation errors before continuing.")
        return
      }
    }

    setIsProcessing(true)
    
    try {
      const addressToUse = useSameForShipping ? shippingAddress : billingAddress;
      const addressWithLowerCase = {
        ...addressToUse,
        country_code: addressToUse.country_code.toLowerCase()
      };
      
      await sdk.store.cart.update(cart.id, {
        billing_address: addressWithLowerCase
      });
      
      // Save the validated data before proceeding
      saveCheckoutField('billingAddress', addressWithLowerCase)
      saveCheckoutField('useSameForBilling', useSameForShipping)
      
      onSubmit()
    } catch (err: any) {
      console.error("Error updating billing address:", err)
      setError(err.message || "Failed to update billing information. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const isNextDisabled = () => {
    if (isProcessing) return true
    if (useSameForShipping) return false
    
    // Check for validation errors
    const hasValidationErrors = Object.values(validationErrors).some(error => error)
    if (hasValidationErrors) return true
    
    return !billingAddress.first_name || !billingAddress.last_name || 
           !billingAddress.address_1 || !billingAddress.city || 
           !billingAddress.postal_code
  }

  const getFieldBorderClass = (fieldName: string, hasError: boolean) => {
    if (hasError) {
      return 'border-red-500 focus-within:border-red-600'
    }
    return 'border-[#797979] focus-within:border-blue-500'
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Billing Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Billing Address Options */}
        <div className="space-y-4">
          <div className="space-y-3">
            {/* Same as shipping address option */}
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                useSameForShipping 
                  ? 'border-gray-400 bg-gray-50' 
                  : 'border-[#E5E5E5] hover:border-[#CCCCCC]'
              }`}
              onClick={() => handleUseSameForShippingChange(true)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    useSameForShipping 
                      ? 'border-gray-500 bg-gray-500' 
                      : 'border-[#CCCCCC]'
                  }`}>
                    {useSameForShipping && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="font-medium text-[#333333]">Same as shipping address</span>
                </div>
              </div>
            </div>

            {/* Different billing address option */}
            <div 
              className={`border-2 rounded-lg transition-all duration-200 ${
                !useSameForShipping 
                  ? 'border-gray-400 bg-gray-50' 
                  : 'border-[#E5E5E5] hover:border-[#CCCCCC]'
              }`}
            >
              <div 
                className="p-4 cursor-pointer"
                onClick={() => handleUseSameForShippingChange(false)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      !useSameForShipping 
                        ? 'border-gray-500 bg-gray-500' 
                        : 'border-[#CCCCCC]'
                    }`}>
                      {!useSameForShipping && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="font-medium text-[#333333]">Use a different billing address</span>
                  </div>
                  {!useSameForShipping ? (
                    <ChevronUp className="w-5 h-5 text-[#666666]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#666666]" />
                  )}
                </div>
              </div>

              {/* Collapsible billing address form */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                !useSameForShipping ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-4 pb-4 space-y-4 border-t border-[#E5E5E5]">
                  {/* Billing form fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className={`border-2 border-[#797979] rounded p-2`}>
                        <input
                          type="text"
                          id="billing_first_name"
                          name="first_name"
                          value={billingAddress.first_name}
                          onChange={handleBillingAddressChange}
                          className="w-full bg-transparent text-base font-semibold outline-none text-black placeholder:text-[#797979]"
                          placeholder="First name"
                          required={!useSameForShipping}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className={`border-2 border-[#797979] rounded p-2`}>
                        <input
                          type="text"
                          id="billing_last_name"
                          name="last_name"
                          value={billingAddress.last_name}
                          onChange={handleBillingAddressChange}
                          className="w-full bg-transparent text-base font-semibold outline-none text-black placeholder:text-[#797979]"
                          placeholder="Last name"
                          required={!useSameForShipping}
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className={`border-2 border-[#797979] rounded p-2`}>
                        <input
                          type="text"
                          id="billing_address_1"
                          name="address_1"
                          value={billingAddress.address_1}
                          onChange={handleBillingAddressChange}
                          className="w-full bg-transparent text-base font-semibold outline-none text-black placeholder:text-[#797979]"
                          placeholder="Address"
                          required={!useSameForShipping}
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className={`border-2 border-[#797979] rounded p-2`}>
                        <input
                          type="text"
                          id="billing_address_2"
                          name="address_2"
                          value={billingAddress.address_2 || ''}
                          onChange={handleBillingAddressChange}
                          className="w-full bg-transparent text-base font-semibold outline-none text-black placeholder:text-[#797979]"
                          placeholder="Apartment, suite, etc. (optional)"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className={`border-2 border-[#797979] rounded p-2`}>
                        <input
                          type="text"
                          id="billing_city"
                          name="city"
                          value={billingAddress.city}
                          onChange={handleBillingAddressChange}
                          className="w-full bg-transparent text-base font-semibold outline-none text-black placeholder:text-[#797979]"
                          placeholder="City"
                          required={!useSameForShipping}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className={`border-2 ${getFieldBorderClass('postal_code', !!validationErrors.postal_code)} rounded p-2 transition-colors`}>
                        <input
                          type="text"
                          id="billing_postal_code"
                          name="postal_code"
                          value={billingAddress.postal_code}
                          onChange={handleBillingAddressChange}
                          className="w-full bg-transparent text-base font-semibold outline-none text-black placeholder:text-[#797979]"
                          placeholder="Postal code"
                          required={!useSameForShipping}
                        />
                      </div>
                      {validationErrors.postal_code && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.postal_code}</p>
                      )}
                    </div>
                    
                    <div>
                      <div className={`border-2 ${getFieldBorderClass('country_code', !!validationErrors.country_code)} rounded p-2 transition-colors`}>
                        <select
                          id="billing_country_code"
                          name="country_code"
                          value={billingAddress.country_code}
                          onChange={handleBillingAddressChange}
                          className="w-full bg-transparent text-base font-semibold outline-none text-black"
                          required={!useSameForShipping}
                        >
                          <option value="" className="text-[#797979]">Select Country</option>
                          <option value="GB" className="text-[#333333]">United Kingdom</option>
                          <option value="US" className="text-[#333333]">United States</option>
                        </select>
                      </div>
                      {validationErrors.country_code && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.country_code}</p>
                      )}
                    </div>
                    
                    <div>
                      <div className={`border-2 ${getFieldBorderClass('phone', !!validationErrors.phone)} rounded p-2 transition-colors`}>
                        <input
                          type="tel"
                          id="billing_phone"
                          name="phone"
                          value={billingAddress.phone || ''}
                          onChange={handleBillingAddressChange}
                          className="w-full bg-transparent text-base font-semibold outline-none text-black placeholder:text-[#797979]"
                          placeholder="Phone number"
                        />
                      </div>
                      {validationErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={isProcessing}
            className="flex items-center gap-2 text-gray-600 font-medium bg-gray-200 hover:bg-gray-300 rounded-full transition-colors px-6 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            type="submit"
            disabled={isNextDisabled()}
            className="bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] border-2 border-[#FFD56A] rounded-full py-2 px-8 text-base font-semibold shadow-inner shadow-black/25 disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#F3C03F]/90 hover:to-[#FFBA0A]/90 active:scale-95 transition-all flex items-center gap-2"
          >
            {isProcessing
              ? "Processing..."
              : <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>}
          </button>
        </div>
      </form>
    </div>
  )
}