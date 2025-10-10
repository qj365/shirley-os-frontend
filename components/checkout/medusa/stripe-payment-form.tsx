"use client"

import React from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { useCart } from "@/services/cart-service"
import { sdk } from "@/config"

interface StripePaymentFormProps {
  clientSecret: string
  goToPreviousStep: () => void
  onComplete: (orderId: string) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  clientSecret,
  goToPreviousStep,
  onComplete,
  isProcessing,
  setIsProcessing,
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const { cart, refreshCart, clearCartSilently } = useCart()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !cart) {
      toast.error("Payment system not ready", {
        description: "Please wait for the payment form to load completely"
      })
      return
    }

    setIsProcessing(true)

    try {
      // First, submit the elements to validate and prepare payment data
      const { error: submitError } = await elements.submit()
      
      if (submitError) {
        console.error("Elements submit error:", submitError)
        toast.error("Payment validation failed", {
          description: submitError.message || "Please check your payment details"
        })
        return
      }

      // Step 1: Confirm payment with Stripe first
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          receipt_email: cart.email || undefined,
        },
        redirect: "if_required"
      })

      if (error) {
        console.error("Payment error:", error)
        toast.error("Payment failed", {
          description: error.message || "An error occurred during payment processing"
        })
        return
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Step 2: Now that payment is confirmed, complete the cart
        try {
          const response = await sdk.store.cart.complete(cart.id)
          
          if (response.type === "order" && response.order) {
            // Payment successful and order created
            toast.success("Payment successful!", {
              description: "Your order has been placed successfully."
            })
            
            // Redirect immediately
            onComplete(response.order.id)
            
            // Clear cart silently in background
            clearCartSilently()
            
          } else if (response.type === "cart" && response.cart) {
            console.log("Cart", cart)
            // Cart completion failed
            console.error("Cart completion failed:", response.error)
            toast.error("Order creation failed", {
              description: "Payment was successful but order creation failed. Please contact support."
            })
          }
        } catch (orderError: any) {
          console.error("Error completing order:", orderError)
          console.log("Cart", cart)
          
          // Check if the error indicates the cart is already completed
          const errorMessage = orderError?.message || orderError?.toString() || ''
          if (errorMessage.includes('already completed')) {
            // Cart was already completed, clear it and refresh
            localStorage.removeItem("cart_id")
            await refreshCart()
            toast.error("Cart already completed", {
              description: "This cart has already been processed. A new cart has been created."
            })
          } else {
            toast.error("Order creation failed", {
              description: "Payment was successful but order creation failed. Please contact support."
            })
          }
        }
      } else {
        toast.error("Payment incomplete", {
          description: "Payment was not completed successfully. Please try again."
        })
      }
    } catch (error) {
      console.error("Unexpected payment error:", error)
      toast.error("Payment failed", {
        description: "An unexpected error occurred. Please try again."
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <PaymentElement
          options={{
            wallets: {
              applePay: 'auto',
              googlePay: 'auto'
            },
            layout: {
              type: 'accordion',
              defaultCollapsed: true,
              radios: true,
              spacedAccordionItems: true
            }
          }}
        />
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={goToPreviousStep}
          className="flex items-center gap-2 text-gray-600 font-medium bg-gray-200 hover:bg-gray-300 rounded-full transition-colors px-6 py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] border-2 border-[#FFD56A] rounded-full py-2 px-8 text-base font-semibold shadow-inner shadow-black/25 disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#F3C03F]/90 hover:to-[#FFBA0A]/90 active:scale-95 transition-all flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              Complete Order
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}