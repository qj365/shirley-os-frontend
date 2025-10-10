"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ActionButtonsSectionProps {
  cartItems: any[];
}

export default function ActionButtonsSection({
  cartItems
}: ActionButtonsSectionProps) {
  const router = useRouter();
  const totalItemQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <div className="mt-6 space-y-3">
      {totalItemQuantity > 0 ? (
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push("/checkout")}
              disabled={totalItemQuantity < Number(process.env.NEXT_PUBLIC_MINIMUM_QUANTITY)}
              className="sm:flex-1 bg-gradient-to-r from-[#F3C03F] to-[#FFBA0A] text-black py-3 px-6 rounded-full hover:from-[#F3C03F]/90 hover:to-[#FFBA0A]/90 transition-all font-semibold active:scale-95 shadow-inner shadow-black/25 mb-3 sm:mb-0 disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#F3C03F]/90 hover:to-[#FFBA0A]/90 active:scale-95 transition-all"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => router.push("/shop")}
              className="sm:flex-1 bg-gray-100 text-gray-900 py-3 px-6 rounded-full hover:bg-gray-200 transition-all font-semibold border border-gray-300 active:scale-95"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            toast.info("Please select at least one item to add to your cart.");
          }}
          className="w-full bg-gray-100 text-gray-500 py-3 px-6 rounded-full border border-gray-300 font-semibold cursor-not-allowed"
        >
          Select Items to Add to Cart
        </button>
      )}
    </div>
  );
}