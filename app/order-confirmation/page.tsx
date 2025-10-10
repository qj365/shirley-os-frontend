"use client"

import { useSearchParams } from "next/navigation"
import { OrderConfirmation } from "@/components/checkout/medusa/order-confirmation"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")

  return (
    <div className="min-h-screen bg-white">
      <div>
        {orderId ? (
          <OrderConfirmation orderId={orderId} />
        ) : (
          <div className="w-full min-h-screen flex flex-col items-center justify-center p-8">
            <div className="text-xl mb-4">Order not found</div>
            <p className="text-gray-600 mb-6">We couldn't find your order. Please check your email for order confirmation details.</p>
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
