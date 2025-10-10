"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useCart } from "@/services/cart-service"
import { CheckoutEmailStep } from "./checkout-email-step"
import { CheckoutAddressStep } from "./checkout-address-step"
import { CheckoutBillingStep } from "./checkout-billing-step"
import { CheckoutPaymentOptionStep } from "./checkout-payment-option-step"
import { CheckoutPaymentStep } from "./checkout-payment-step"
// Add validation and storage imports with correct function names
import { 
  validatePhoneNumber, 
  validatePostalCode, 
  validateCountryCode, 
  validateEmail,
  validateAddressForm,
  isAddressFormValid,
  type ValidationResult 
} from "@/lib/checkout-validation"
import { 
  saveCheckoutData, 
  loadCheckoutData, 
  clearCheckoutData,
  saveCheckoutField,
  loadCheckoutField 
} from "@/lib/checkout-storage"

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

// Add validation state interface
interface ValidationErrors {
  email?: string
  shippingAddress?: {
    phone?: string
    postal_code?: string
    country_code?: string
    [key: string]: string | undefined
  }
  billingAddress?: {
    phone?: string
    postal_code?: string
    country_code?: string
    [key: string]: string | undefined
  }
}

interface MedusaCheckoutProps {
  currentStep: number
  setCurrentStep: (step: number) => void
}

export const MedusaCheckout: React.FC<MedusaCheckoutProps> = ({
  currentStep,
  setCurrentStep
}) => {
  const router = useRouter()
  const { cart } = useCart()
  const totalQuantity =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  const minQuantity = parseInt(
    process.env.NEXT_PUBLIC_MINIMUM_QUANTITY || "3",
    10
  )
  const hasMinimumItems = totalQuantity >= minQuantity

  // Add refs to track component state
  const isInitialLoad = useRef(true)
  const hasShownMinimumToast = useRef(false)
  const previousTotalQuantity = useRef(totalQuantity)

  // Add validation state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    // Skip on initial load
    if (isInitialLoad.current) {
      isInitialLoad.current = false
      previousTotalQuantity.current = totalQuantity
      // Load saved checkout data on initial load
      loadSavedCheckoutData()
      return
    }

    if (
      totalQuantity > 0 && 
      !hasMinimumItems && 
      !hasShownMinimumToast.current &&
      totalQuantity < previousTotalQuantity.current
    ) {
      toast.error("Minimum Cart Requirement", {
        description: `Please add at least ${minQuantity} items to your cart to proceed.`,
      })
      hasShownMinimumToast.current = true
    }

    // Reset the toast flag if user adds items back above minimum
    if (hasMinimumItems && hasShownMinimumToast.current) {
      hasShownMinimumToast.current = false
    }

    // Update previous quantity
    previousTotalQuantity.current = totalQuantity
  }, [hasMinimumItems, minQuantity, totalQuantity])
  
  // Email step state
  const [email, setEmail] = useState("")
  
  // Address step state
  const [shippingAddress, setShippingAddress] = useState<AddressFormData>({
    first_name: "",
    last_name: "",
    address_1: "",
    city: "",
    country_code: "GB",
    postal_code: ""
  })
  
  const [billingAddress, setBillingAddress] = useState<AddressFormData>({
    first_name: "",
    last_name: "",
    address_1: "",
    city: "",
    country_code: "GB",
    postal_code: ""
  })
  
  const [useSameForBilling, setUseSameForBilling] = useState(true)
  
  // Payment option state
  const [paymentType, setPaymentType] = useState<'one-time' | 'subscription'>('one-time')
  const [subscriptionConfig, setSubscriptionConfig] = useState({
    interval: 'MONTHLY' as 'MONTHLY' | 'YEARLY',
    period: 1
  })

  // Load saved checkout data function
  const loadSavedCheckoutData = () => {
    const savedData = loadCheckoutData()
    if (savedData) {
      if (savedData.email) setEmail(savedData.email)
      if (savedData.shippingAddress) setShippingAddress(savedData.shippingAddress)
      if (savedData.billingAddress) setBillingAddress(savedData.billingAddress)
      if (savedData.useSameForBilling !== undefined) setUseSameForBilling(savedData.useSameForBilling)
      if (savedData.paymentType) setPaymentType(savedData.paymentType)
      if (savedData.subscriptionConfig) setSubscriptionConfig(savedData.subscriptionConfig)
    }
  }

  // Save checkout data function
  const saveCurrentCheckoutData = () => {
    const checkoutData = {
      email,
      shippingAddress,
      billingAddress,
      useSameForBilling,
      paymentType,
      subscriptionConfig
    }
    saveCheckoutData(checkoutData)
  }

  // Enhanced email setter with validation and storage
  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail)
    saveCheckoutField('email', newEmail)
    
    // Real-time email validation
    if (newEmail.trim()) {
      const emailValidation = validateEmail(newEmail)
      setValidationErrors(prev => ({
        ...prev,
        email: emailValidation.isValid ? undefined : emailValidation.error
      }))
    } else {
      setValidationErrors(prev => ({ ...prev, email: undefined }))
    }
  }

  // Enhanced shipping address setter with validation and storage
  const handleShippingAddressChange = (newAddress: AddressFormData) => {
    setShippingAddress(newAddress)
    saveCheckoutField('shippingAddress', newAddress)
    
    // Real-time validation for specific fields
    const errors: ValidationErrors['shippingAddress'] = {}
    
    if (newAddress.phone) {
      const phoneValidation = validatePhoneNumber(newAddress.phone, newAddress.country_code)
      if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.error
      }
    }
    
    if (newAddress.postal_code) {
      const postalValidation = validatePostalCode(newAddress.postal_code, newAddress.country_code)
      if (!postalValidation.isValid) {
        errors.postal_code = postalValidation.error
      }
    }
    
    if (newAddress.country_code) {
      const countryValidation = validateCountryCode(newAddress.country_code)
      if (!countryValidation.isValid) {
        errors.country_code = countryValidation.error
      }
    }
    
    setValidationErrors(prev => ({
      ...prev,
      shippingAddress: Object.keys(errors).length > 0 ? errors : undefined
    }))
  }

  // Enhanced billing address setter with validation and storage
  const handleBillingAddressChange = (newAddress: AddressFormData) => {
    setBillingAddress(newAddress)
    saveCheckoutField('billingAddress', newAddress)
    
    // Real-time validation for specific fields
    const errors: ValidationErrors['billingAddress'] = {}
    
    if (newAddress.phone) {
      const phoneValidation = validatePhoneNumber(newAddress.phone, newAddress.country_code)
      if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.error
      }
    }
    
    if (newAddress.postal_code) {
      const postalValidation = validatePostalCode(newAddress.postal_code, newAddress.country_code)
      if (!postalValidation.isValid) {
        errors.postal_code = postalValidation.error
      }
    }
    
    if (newAddress.country_code) {
      const countryValidation = validateCountryCode(newAddress.country_code)
      if (!countryValidation.isValid) {
        errors.country_code = countryValidation.error
      }
    }
    
    setValidationErrors(prev => ({
      ...prev,
      billingAddress: Object.keys(errors).length > 0 ? errors : undefined
    }))
  }

  // Enhanced step navigation with validation
  const goToNextStep = async () => {
    setIsValidating(true)
    let canProceed = true
    
    // Validate current step before proceeding
    switch (currentStep) {
      case 0: // Email validation
        const emailValidation = validateEmail(email)
        if (!emailValidation.isValid) {
          setValidationErrors(prev => ({ ...prev, email: emailValidation.error }))
          canProceed = false
        }
        break
        
      case 1: // Shipping address validation
        if (!isAddressFormValid(shippingAddress)) {
          const shippingValidation = validateAddressForm(shippingAddress)
          const errors: ValidationErrors['shippingAddress'] = {}
          Object.entries(shippingValidation).forEach(([key, result]) => {
            if (!result.isValid) {
              errors[key] = result.error
            }
          })
          setValidationErrors(prev => ({ ...prev, shippingAddress: errors }))
          canProceed = false
        }
        break
        
      case 2: // Billing address validation (if not using same as shipping)
        if (!useSameForBilling && !isAddressFormValid(billingAddress)) {
          const billingValidation = validateAddressForm(billingAddress)
          const errors: ValidationErrors['billingAddress'] = {}
          Object.entries(billingValidation).forEach(([key, result]) => {
            if (!result.isValid) {
              errors[key] = result.error
            }
          })
          setValidationErrors(prev => ({ ...prev, billingAddress: errors }))
          canProceed = false
        }
        break
    }
    
    if (canProceed) {
      saveCurrentCheckoutData()
      setCurrentStep(currentStep + 1)
    } else {
      toast.error("Please fix the validation errors before continuing.")
    }
    
    setIsValidating(false)
  }
  
  const goToPreviousStep = () => {
    saveCurrentCheckoutData()
    setCurrentStep(currentStep - 1)
  }
  
  // Handle order completion - clear saved data and redirect
  const handleOrderComplete = (id: string) => {
    // Clear saved checkout data after successful order
    clearCheckoutData()
    // Use 'order_id' to match what the order confirmation page expects
    router.push(`/order-confirmation?order_id=${id}`)
  }

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 0: // Email step
        return (
          <CheckoutEmailStep 
            email={email}
            setEmail={handleEmailChange}
            onSubmit={goToNextStep}
            validationError={validationErrors.email}
          />
        )
      case 1: // Shipping Address step
        return (
          <CheckoutAddressStep 
            shippingAddress={shippingAddress}
            setShippingAddress={handleShippingAddressChange}
            onSubmit={goToNextStep}
            goToPreviousStep={goToPreviousStep}
            validationErrors={validationErrors.shippingAddress}
          />
        )
      case 2: // Billing Address step
        return (
          <CheckoutBillingStep 
            billingAddress={billingAddress}
            setBillingAddress={handleBillingAddressChange}
            useSameForShipping={useSameForBilling}
            setUseSameForShipping={setUseSameForBilling}
            shippingAddress={shippingAddress}
            onSubmit={goToNextStep}
            goToPreviousStep={goToPreviousStep}
            validationErrors={validationErrors.billingAddress}
          />
        )
      case 3: // Payment Option step
        return (
          <CheckoutPaymentOptionStep
            paymentType={paymentType}
            setPaymentType={setPaymentType}
            subscriptionConfig={subscriptionConfig}
            setSubscriptionConfig={setSubscriptionConfig}
            onSubmit={goToNextStep}
            goToPreviousStep={goToPreviousStep}
          />
        )
      case 4: // Payment step
        return (
          <CheckoutPaymentStep
            paymentType={paymentType}
            subscriptionConfig={subscriptionConfig}
            onComplete={handleOrderComplete}
            goToPreviousStep={goToPreviousStep}
          />
        )
    }
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress indicator */}
      {currentStep < 5 && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {["Email", "Shipping", "Billing", "Option", "Payment"].map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index < currentStep 
                        ? 'bg-green-500 text-black font-bold' 
                        : index === currentStep 
                          ? 'bg-[#FFC020] text-black font-bold' 
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm mt-2 ${
                    index === currentStep ? 'font-bold' : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                </div>
                
                {index < 4 && (
                  <div 
                    className={`flex-1 h-1 mx-2 ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      
      {/* Minimum Cart Warning */}
      {!hasMinimumItems && (
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">Minimum Cart Requirement</h3>
              <p className="text-md text-gray-600 mt-2">
                Please add at least {minQuantity} items in total to your cart before
                proceeding with checkout.
              </p>
              <Link
                href="/shop"
                className="mt-3 inline-flex items-center gap-2 text-gray-600 font-medium transition-colors border border-gray-200 p-2 px-4 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Current step content */}
      <div className="mb-8">
        {hasMinimumItems ? renderStep() : null}
      </div>
    </div>
  )
}