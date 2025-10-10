// app/checkout/page.tsx
"use client"

import { MedusaCheckout } from "@/components/checkout/medusa/medusa-checkout"
import MedusaRightCheckout from "@/components/checkout/medusa/medusa-right-checkout"
import { useState } from "react"
import React from "react"

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-24 md:pt-28 lg:pt-40">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-20">
            {/* Left column - Checkout form */}
            <div className="md:col-span-3">
              <MedusaCheckout
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />
            </div>
            
            {/* Right column - Order summary */}
            <div className="md:col-span-3">
              <MedusaRightCheckout 
                showSummary={currentStep === 4}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
