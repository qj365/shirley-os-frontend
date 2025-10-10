"use client"

import React, { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { useCart } from "@/services/cart-service"
import { sdk } from "@/config"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { StripePaymentForm } from "@/components/checkout/medusa/stripe-payment-form"
import { useAuth } from "@/hooks/auth"
import subscriptionService from "@/services/subscription-service"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_KEY || ""
)

interface SubscriptionConfig {
  interval: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | 'BI_MONTHLY' | 'QUARTERLY'
}

interface CheckoutPaymentStepProps {
  paymentType: 'one-time' | 'subscription'
  subscriptionConfig?: SubscriptionConfig
  onComplete: (orderId: string) => void
  goToPreviousStep: () => void
}

export const CheckoutPaymentStep: React.FC<CheckoutPaymentStepProps> = ({
  paymentType,
  subscriptionConfig,
  onComplete,
  goToPreviousStep,
}) => {
  const { cart } = useCart()
  const { isAuthenticated } = useAuth()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [initializationError, setInitializationError] = useState<string | null>(
    null
  )
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null)

  // Ref to track which cart ID we have initiated payment session for.
  const initializedCartId = useRef<string | null>(null)

  // Helper function to get interval description
  const getIntervalDescription = (interval: string) => {
    const descriptions = {
      'WEEKLY': 'weekly',
      'BI_WEEKLY': 'every 2 weeks',
      'MONTHLY': 'monthly',
      'BI_MONTHLY': 'every 2 months',
      'QUARTERLY': 'every 3 months'
    }
    return descriptions[interval as keyof typeof descriptions] || interval.toLowerCase()
  }

  // Helper function to retry initialization
  const retryInitialization = () => {
    setInitializationError(null)
    initializedCartId.current = null
    setIsInitializing(true)
  }

  // Initialize payment session
  useEffect(() => {
    const initializePaymentSession = async () => {
      if (!cart || !cart.id) {
        setIsInitializing(false)
        return
      }

      // If we've already initialized for this cart, don't do it again.
      if (initializedCartId.current === cart.id) {
        return
      }

      // First, check if a valid payment session already exists on the cart.
      const existingSession = cart.payment_collection?.payment_sessions?.find(
        (s: any) =>
          s.provider_id === "pp_stripe_stripe" && s.data?.client_secret
      )

      if (existingSession) {
        console.log("Using existing payment session for cart:", cart.id)
        setClientSecret(existingSession.data.client_secret as string)
        initializedCartId.current = cart.id
        setIsInitializing(false)
        return
      }

      // Mark this cart as "in-progress" to prevent duplicate calls.
      initializedCartId.current = cart.id
      setIsInitializing(true)
      setInitializationError(null)

      try {
        // Create subscription first if payment type is subscription
        if (paymentType === 'subscription' && subscriptionConfig) {
          try {
            // Use new API structure for creating subscription
            const subscription = await subscriptionService.createSubscriptionFromCart(
              cart,
              subscriptionConfig.interval,
              isAuthenticated
            )
            
            setSubscriptionId(subscription.subscription.id)
            toast.success('Subscription created successfully')
          } catch (subscriptionError: any) {
            console.error('Error creating subscription:', subscriptionError)
            
            // Better error handling for different error types
            let errorMessage = 'Failed to create subscription. Please try again.'
            
            if (subscriptionError.message?.includes('401') || subscriptionError.message?.includes('Unauthorized')) {
              errorMessage = 'Authentication required. Please log in to create a subscription.'
            } else if (subscriptionError.message?.includes('400') || subscriptionError.message?.includes('Bad Request')) {
              errorMessage = 'Invalid subscription data. Please check your cart items.'
            } else if (subscriptionError.message?.includes('network') || subscriptionError.message?.includes('fetch')) {
              errorMessage = 'Network error. Please check your connection and try again.'
            }
            
            setInitializationError(errorMessage)
            toast.error('Subscription Creation Failed', {
              description: errorMessage
            })
            initializedCartId.current = null
            setIsInitializing(false)
            return
          }
        }

        const response = await sdk.store.payment.initiatePaymentSession(cart, {
          provider_id: "pp_stripe_stripe",
        })

        const newPaymentSession =
          response.payment_collection?.payment_sessions?.find(
            (session: any) => session.provider_id === "pp_stripe_stripe"
          )

        if (newPaymentSession?.data?.client_secret) {
          setClientSecret(newPaymentSession.data.client_secret as string)
        } else {
          throw new Error("Failed to get client secret from payment session")
        }
      } catch (error: any) {
        console.error("Error initializing payment session:", error)
        
        // Better error handling for payment session errors
        let errorMessage = "Failed to initialize payment session"
        
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          errorMessage = 'Authentication required. Please log in to continue.'
        } else if (error.message?.includes('400') || error.message?.includes('Bad Request')) {
          errorMessage = 'Invalid cart data. Please check your items and try again.'
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (error.message) {
          errorMessage = error.message
        }
        
        setInitializationError(errorMessage)
        initializedCartId.current = null
      } finally {
        setIsInitializing(false)
      }
    }

    initializePaymentSession()
  }, [cart, paymentType, subscriptionConfig, isAuthenticated])

  const handlePaymentComplete = async (orderId: string) => {
    // If this was a subscription payment, update the subscription with the order ID
    if (paymentType === 'subscription' && subscriptionId) {
      try {
        await subscriptionService.updateSubscription(subscriptionId, {
          order_id: orderId,
          status: 'ACTIVE'
        })
        toast.success('Subscription activated successfully!')
      } catch (error: any) {
        console.error('Error updating subscription:', error)
        // Don't fail the entire flow, just log the error
        toast.warning('Order completed but subscription update failed. Please contact support.')
      }
    }
    
    onComplete(orderId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Payment Information</h2>
        {paymentType === 'subscription' && subscriptionConfig && (
          <p className="text-sm text-gray-600 mt-2">
            Setting up {getIntervalDescription(subscriptionConfig.interval)} subscription
          </p>
        )}
      </div>
      
      {/* Payment initialization loading */}
      {isInitializing && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFC020]"></div>
          <span className="ml-3 text-gray-600">
            {paymentType === 'subscription' ? 'Setting up subscription and payment...' : 'Setting up payment...'}
          </span>
        </div>
      )}

      {/* Payment initialization error - improved UI similar to email step */}
      {initializationError && (
        <div className="space-y-4">
          <div className="border-1 border-red-500 rounded p-4 bg-red-50">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Payment Setup Error</h3>
                <p className="text-sm text-red-700 mt-1">{initializationError}</p>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-between">
            <button
              onClick={goToPreviousStep}
              className="bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 rounded-full py-2 px-6 text-base font-semibold transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            
            <button
              onClick={retryInitialization}
              className="bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] border-2 border-[#FFD56A] rounded-full py-2 px-6 text-base font-semibold shadow-inner shadow-black/25 hover:from-[#F3C03F]/90 hover:to-[#FFBA0A]/90 active:scale-95 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Payment form - only show when client secret is available */}
      {clientSecret && !initializationError && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            // appearance: {
            //   theme: 'stripe',
            //   variables: {
            //     colorPrimary: '#FFC020',
            //   }
            // }
          }}
        >
          <StripePaymentForm
            clientSecret={clientSecret}
            goToPreviousStep={goToPreviousStep}
            onComplete={handlePaymentComplete}
            isProcessing={isProcessingPayment}
            setIsProcessing={setIsProcessingPayment}
          />
        </Elements>
      )}
    </div>
  )
}