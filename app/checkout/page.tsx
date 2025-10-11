// app/checkout/page.tsx
"use client"

import React from "react"
import Link from "next/link"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-24 md:pt-28 lg:pt-40">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">Checkout Coming Soon</h1>
            <p className="text-gray-600 mb-8">
              Our checkout system is currently being upgraded to serve you better.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
