import React from "react"
import { useCart } from "@/services/cart-service"
import { sdk } from "@/config"
import { ArrowLeft, ArrowRight } from "lucide-react"
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

interface CheckoutAddressStepProps {
  shippingAddress: AddressFormData
  setShippingAddress: (address: AddressFormData) => void
  onSubmit: () => void
  goToPreviousStep: () => void
  validationErrors?: {
    phone?: string
    postal_code?: string
    country_code?: string
    [key: string]: string | undefined
  }
}

export const CheckoutAddressStep: React.FC<CheckoutAddressStepProps> = ({
  shippingAddress,
  setShippingAddress,
  onSubmit,
  goToPreviousStep,
  validationErrors: propValidationErrors
}) => {
  const { cart, formatPrice, refreshCart } = useCart()
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [shippingOptions, setShippingOptions] = React.useState<any[]>([])
  const [selectedShippingOption, setSelectedShippingOption] = React.useState<string>("")
  const [validationErrors, setValidationErrors] = React.useState<{
    phone?: string
    postal_code?: string
    country_code?: string
  }>({}) 

  // Fetch shipping options when address is updated
  const fetchShippingOptions = async () => {
    if (!cart) return
    
    try {
      // Update cart with shipping address before fetching options
      const shippingAddressWithLowerCase = {
        ...shippingAddress,
        country_code: shippingAddress.country_code.toLowerCase()
      }
      await sdk.store.cart.update(cart.id, {
        shipping_address: shippingAddressWithLowerCase
      })

      const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
        cart_id: cart.id
      })
      
      setShippingOptions(shipping_options)
      if (shipping_options.length > 0 && !selectedShippingOption) {
        setSelectedShippingOption(shipping_options[0].id)
      }
    } catch (err) {
      console.error("Error fetching shipping options:", err)
    }
  }

  // Load saved shipping address data on component mount
  React.useEffect(() => {
    const savedShippingAddress = loadCheckoutField('shippingAddress')
    
    if (savedShippingAddress && Object.keys(shippingAddress).every(key => !shippingAddress[key as keyof AddressFormData])) {
      setShippingAddress(savedShippingAddress)
    }
  }, [])

  const validateField = (name: string, value: string) => {
    let error = ''
    
    switch (name) {
      case 'phone':
        if (value.trim()) {
          const phoneValidation = validatePhoneNumber(value, shippingAddress.country_code || 'US')
          if (!phoneValidation.isValid) {
            error = phoneValidation.error || 'Invalid phone number'
          }
        }
        break
      case 'postal_code':
        if (value.trim()) {
          const postalValidation = validatePostalCode(value, shippingAddress.country_code || 'US')
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

  const handleShippingAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const updatedAddress = {
      ...shippingAddress,
      [name]: value
    }
    setShippingAddress(updatedAddress)
    
    // Save shipping address to localStorage on every change
    saveCheckoutField('shippingAddress', updatedAddress)
    
    // Validate field on change
    if (['phone', 'postal_code', 'country_code'].includes(name)) {
      validateField(name, value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!cart) {
      setError("Cart not found. Please try again.")
      return
    }

    setIsProcessing(true)
    
    try {
      // Update cart with shipping address
      const shippingAddressWithLowerCase = {
        ...shippingAddress,
        country_code: shippingAddress.country_code.toLowerCase()
      }
      
      await sdk.store.cart.update(cart.id, {
        shipping_address: shippingAddressWithLowerCase
      })
      
      // Add shipping method to cart
      if (selectedShippingOption) {
        await sdk.store.cart.addShippingMethod(cart.id, {
          option_id: selectedShippingOption
        })
        
        // Refresh cart to update shipping_total in the UI
        await refreshCart()
      } else {
        throw new Error("Please select a shipping method.")
      }
      
      onSubmit()
    } catch (err: any) {
      console.error("Error updating addresses:", err)
      setError(err.message || "Failed to update shipping information. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Fetch shipping options when component mounts or address changes
  React.useEffect(() => {
    if (cart && shippingAddress.country_code && shippingAddress.postal_code) {
      const timer = setTimeout(() => {
        fetchShippingOptions()
      }, 500) // Debounce
      return () => clearTimeout(timer)
    }
  }, [cart, shippingAddress.country_code, shippingAddress.postal_code])

  const isNextDisabled = () => {
    return isProcessing || !shippingAddress.first_name || !shippingAddress.last_name || 
           !shippingAddress.address_1 || !shippingAddress.city || 
           !shippingAddress.postal_code || !selectedShippingOption
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Shipping Information</h2>
      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping Address Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className={`border-2 ${!shippingAddress.first_name ? "border-[#797979]" : "border-[#797979]"} rounded p-2`}>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={shippingAddress.first_name}
                  onChange={handleShippingAddressChange}
                  className="w-full bg-transparent text-base font-semibold outline-none text-black placeholder:text-[#797979]"
                  placeholder="First name"
                  required
                />
              </div>
            </div>
            
            <div>
              <div className={`border-2 ${!shippingAddress.last_name ? "border-[#797979]" : "border-[#797979]"} rounded p-2`}>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={shippingAddress.last_name}
                  onChange={handleShippingAddressChange}
                  className="w-full bg-transparent text-base font-semibold outline-none text-black placeholder:text-[#797979]"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className={`border-2 ${!shippingAddress.address_1 ? "border-[#797979]" : "border-[#797979]"} rounded p-2`}>
                <input
                  type="text"
                  id="address_1"
                  name="address_1"
                  value={shippingAddress.address_1}
                  onChange={handleShippingAddressChange}
                  className="w-full bg-transparent text-base font-semibold outline-none text-black placeholder:text-[#797979]"
                  placeholder="Address"
                  required
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className={`border-2 border-[#797979] rounded p-2`}>
                <input
                  type="text"
                  id="address_2"
                  name="address_2"
                  value={shippingAddress.address_2 || ''}
                  onChange={handleShippingAddressChange}
                  className="w-full bg-transparent text-base font-semibold outline-none text-black placeholder:text-[#797979]"
                  placeholder="Apartment, suite, etc. (optional)"
                />
              </div>
            </div>
            
            <div>
              <div className={`border-2 ${!shippingAddress.city ? "border-[#797979]" : "border-[#797979]"} rounded p-2`}>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleShippingAddressChange}
                  className="w-full bg-transparent text-base font-semibold outline-none text-black placeholder:text-[#797979]"
                  placeholder="City"
                  required
                />
              </div>
            </div>
            
            <div>
              <div className={`border-2 ${!shippingAddress.postal_code ? "border-[#797979]" : "border-[#797979]"} rounded p-2`}>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  value={shippingAddress.postal_code}
                  onChange={handleShippingAddressChange}
                  className="w-full bg-transparent text-base font-semibold outline-none text-black placeholder:text-[#797979]"
                  placeholder="Postal code"
                  required
                />
              </div>
              {validationErrors.postal_code && (
                <div className="text-red-600 text-sm mt-1">
                  {validationErrors.postal_code}
                </div>
              )}
            </div>
            
            <div>
              <div className={`border-2 ${!shippingAddress.country_code ? "border-[#797979]" : "border-[#797979]"} rounded p-2`}>
                <select
                  id="country_code"
                  name="country_code"
                  value={shippingAddress.country_code}
                  onChange={handleShippingAddressChange}
                  className="w-full bg-transparent text-base font-semibold outline-none text-black"
                  required
                >
                  <option value="" className="text-[#797979]">Select Country</option>
                  <option value="GB" className="text-[#333333]" selected>United Kingdom</option>
                  {/* <option value="US" className="text-[#333333]">United States</option> */}
                </select>
              </div>
              {validationErrors.country_code && (
                <div className="text-red-600 text-sm mt-1">
                  {validationErrors.country_code}
                </div>
              )}
            </div>
            
            <div>
              <div className={`border-2 border-[#797979] rounded p-2`}>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingAddress.phone || ''}
                  onChange={handleShippingAddressChange}
                  className="w-full bg-transparent text-base font-semibold outline-none text-black placeholder:text-[#797979]"
                  placeholder="Phone number"
                />
              </div>
              {validationErrors.phone && (
                <div className="text-red-600 text-sm mt-1">
                  {validationErrors.phone}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Shipping Options */}
        {shippingOptions.length > 0 && (
          <div className="space-y-4">
            
            <div className="space-y-3">
              {shippingOptions.map((option) => (
                <div 
                  key={option.id} 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedShippingOption === option.id
                      ? 'border-gray-400 bg-gray-50' 
                      : 'border-[#E5E5E5] hover:border-[#CCCCCC]'
                  }`}
                  onClick={() => setSelectedShippingOption(option.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedShippingOption === option.id
                          ? 'border-gray-500 bg-gray-500' 
                          : 'border-[#CCCCCC]'
                      }`}>
                        {selectedShippingOption === option.id && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="font-medium text-[#333333]">
                        {option.name} - {formatPrice(option.amount) || "Free"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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