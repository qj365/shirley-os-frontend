"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { FaFacebook, FaSquareInstagram } from "react-icons/fa6"
import PaymentIcons from "../product-detail/payment-icons"
import { useState } from "react"
import { toast } from "sonner"
import { subscribeToNewsletter } from '@/services/newsletter-service'

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    if (email.trim() === "" || !email.includes("@")) {
      toast.error("Please enter a valid email address.")
      return
    }

    setIsLoading(true)
    
    try {
      const response = await subscribeToNewsletter(email)
      toast.success(response.message || "Successfully subscribed to our newsletter!")
      setEmail("") // Clear the input on success
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to subscribe. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="relative w-full">
      {/* Newsletter Section */}
      <div className="flex flex-col items-center w-full py-8 md:py-12 px-4 gap-8 md:gap-16 bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A]">
        <div className="flex flex-col items-center gap-6 max-w-6xl mx-auto w-full">
          <h2 className="hidden md:block text-2xl md:text-2xl lg:text-3xl font-bold text-center capitalize">
            Newsletter Signup
          </h2>
          <h2 className="block md:hidden text-2xl md:text-2xl lg:text-3xl font-bold text-center capitalize">
            Join For Hot Offers
          </h2>
          <p className="text-lg md:text-xl lg:text-xl text-center capitalize max-w-4xl">
            Stay connected with Shirley&apos;s for new products, recipes, and cultural insights
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center bg-white rounded-xl p-2 max-w-3xl w-full">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 text-lg md:text-xl font-semibold text-gray-500 p-2 w-full md:w-auto focus:outline-none"
            disabled={isLoading}
          />

          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full md:w-auto mt-3 md:mt-0 py-2 px-6 bg-gradient-to-br 
          from-[#F3C03F] to-[#FFBA0A] rounded-md text-black font-semibold text-base md:text-lg active:scale-95 hover:cursor-pointer disabled:opacity-70"
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </button>
        </div>
      </div>

      {/* Main Footer Section with Background Image */}
      <div className="relative w-full bg-[url('/image/footerImage.png')] bg-cover bg-center">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black to-black/30" />

        {/* Footer Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2  gap-8 md:gap-16">
            {/* Left Column */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col ">
                {/* Logo */}
                <div className="w-[196px] h-[68px] flex items-center justify-center ">
                  <Image
                    src="/image/Logo_white.png"
                    className="object-cover "
                    alt="Shirley's Logo"
                    width={196}
                    height={68}
                  />
                </div>

                <p className="text-white text-lg md:text-xl leading-relaxed">
                  West African culinary heritage, reimagined for modern kitchens. All Shirley&apos;s products are 100%
                  authentic, vegan, and halal-certified, designed to preserve cultural traditions while saving valuable
                  time
                </p>
              </div>

              <Link
                href="#"
                className="flex items-center justify-center gap-2 active:scale-95 bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] border-2 border-[#FFD56A] rounded-full py-3 px-6 w-fit shadow-inner text-black font-medium text-xl"
              >
                <span>Discover Our Stories</span>
                <ArrowRight />
              </Link>
            </div>

          </div>

          {/* Divider */}
          <div className="border-t border-white/50 my-12"></div>

          {/* Copyright & Payment Icons */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-white text-sm text-center md:text-left">
              Copyright © 2025 – Shirley&apos;s Jollof Paste a company of SS World Ltd and the Shirley&apos;s brand –
              All Rights Reserved.
            </p>

            <PaymentIcons />
          </div>

          {/* Divider */}
          <div className="border-t border-white/50 my-8"></div>

          {/* Bottom Logo and Social Icons */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Small Logo */}
            <div className="h-12 w-12">
              <Image src="/image/logo_c_white.png" alt="Shirley's Logo" width={41} height={68} />
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <Link href="https://www.facebook.com/shirleysfoods/" target="_blank" rel="noopener noreferrer">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <FaFacebook size={20} />
                </div>
              </Link>
              <Link href="https://www.instagram.com/shirleysjollofpaste/" target="_blank" rel="noopener noreferrer">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <FaSquareInstagram size={20} />
                </div>
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
