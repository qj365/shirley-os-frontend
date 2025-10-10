import React, { useEffect, useState } from "react"
import { useCart } from "@/services/cart-service"
import { sdk } from "@/config"
import { useAuth } from "@/hooks/auth"
import { ArrowRight } from "lucide-react"
import { validateEmail } from "@/lib/checkout-validation"
import { saveCheckoutField, loadCheckoutField } from "@/lib/checkout-storage"

interface CheckoutEmailStepProps {
  email: string
  setEmail: (email: string) => void
  onSubmit: () => void
  validationError?: string
}

export const CheckoutEmailStep: React.FC<CheckoutEmailStepProps> = ({
  email,
  setEmail,
  onSubmit,
  validationError
}) => {
  const { cart } = useCart()
  const { isAuthenticated, customer } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localValidationError, setLocalValidationError] = useState<string | null>(null)

  // Load saved email data on component mount
  useEffect(() => {
    const savedEmail = loadCheckoutField('email')
    if (savedEmail && !email) {
      setEmail(savedEmail)
    }
  }, [])

  // Auto-populate email if user is logged in
  useEffect(() => {
    if (isAuthenticated && customer?.email && !email) {
      setEmail(customer.email)
      // Save the auto-populated email
      saveCheckoutField('email', customer.email)
    }
  }, [isAuthenticated, customer, email, setEmail])

  // Real-time validation on email change
  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail)
    
    // Save email to localStorage on every change
    saveCheckoutField('email', newEmail)
    
    // Clear previous errors
    setError(null)
    setLocalValidationError(null)
    
    // Perform real-time validation
    if (newEmail.trim()) {
      const validation = validateEmail(newEmail)
      if (!validation.isValid) {
        setLocalValidationError(validation.error || 'Invalid email format')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!cart) {
      setError("Cart not found. Please try again.")
      return
    }

    // Use our validation library instead of basic regex
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setError(emailValidation.error || "Please enter a valid email address.")
      return
    }

    setIsProcessing(true)
    try {
      await sdk.store.cart.update(cart.id, { email })
      // Save the validated email before proceeding
      saveCheckoutField('email', email)
      onSubmit()
    } catch (err) {
      console.error("Error updating email:", err)
      setError("Failed to update email. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Determine which error to show (validation error from parent, local validation, or submission error)
  const displayError = validationError || localValidationError || error
  const hasError = Boolean(displayError)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Contact Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className={`border-2 ${hasError ? "border-red-500" : "border-[#797979]"} rounded p-2 transition-colors`}>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className="w-full bg-transparent text-base font-semibold outline-none text-black placeholder:text-[#797979]"
              placeholder="your@email.com"
              required
            />
          </div>
          {displayError && (
            <p className="text-red-500 text-sm mt-1 animate-in slide-in-from-top-1 duration-200">
              {displayError}
            </p>
          )}
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={isProcessing || !email || hasError}
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