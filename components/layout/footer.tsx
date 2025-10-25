'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { FaFacebook, FaSquareInstagram } from 'react-icons/fa6';
import PaymentIcons from '../product-detail/payment-icons';
import { useState } from 'react';
import { toast } from 'sonner';
import { subscribeToNewsletter } from '@/services/newsletter-service';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (email.trim() === '' || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await subscribeToNewsletter(email);
      toast.success(
        response.message || 'Successfully subscribed to our newsletter!'
      );
      setEmail(''); // Clear the input on success
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to subscribe. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="relative w-full">
      {/* Newsletter Section */}
      <div className="flex w-full flex-col items-center gap-8 bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] px-4 py-8 md:gap-16 md:py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6">
          <h2 className="hidden text-center text-2xl font-bold capitalize md:block md:text-2xl lg:text-3xl">
            Newsletter Signup
          </h2>
          <h2 className="block text-center text-2xl font-bold capitalize md:hidden md:text-2xl lg:text-3xl">
            Join For Hot Offers
          </h2>
          <p className="max-w-4xl text-center text-lg capitalize md:text-xl lg:text-xl">
            Stay connected with Shirley&apos;s for new products, recipes, and
            cultural insights
          </p>
        </div>

        <div className="flex w-full max-w-3xl flex-col items-center rounded-xl bg-white p-2 md:flex-row">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full flex-1 p-2 text-lg font-semibold text-gray-500 focus:outline-none md:w-auto md:text-xl"
            disabled={isLoading}
          />

          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="mt-3 w-full rounded-md bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] px-6 py-2 text-base font-semibold text-black hover:cursor-pointer active:scale-95 disabled:opacity-70 md:mt-0 md:w-auto md:text-lg"
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      </div>

      {/* Main Footer Section with Background Image */}
      <div className="relative w-full bg-[url('/image/footerImage.png')] bg-cover bg-center">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black to-black/30" />

        {/* Footer Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
            {/* Left Column */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                {/* Logo */}
                <div className="flex h-[68px] w-[196px] items-center justify-center">
                  <Image
                    src="/image/Logo_white.png"
                    className="object-cover"
                    alt="Shirley's Logo"
                    width={196}
                    height={68}
                  />
                </div>

                <p className="text-lg leading-relaxed text-white md:text-xl">
                  West African culinary heritage, reimagined for modern
                  kitchens. All Shirley&apos;s products are 100% authentic,
                  vegan, and halal-certified, designed to preserve cultural
                  traditions while saving valuable time
                </p>
              </div>

              <Link
                href="#"
                className="flex w-fit items-center justify-center gap-2 rounded-full border-2 border-[#FFD56A] bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] px-6 py-3 text-xl font-medium text-black shadow-inner active:scale-95"
              >
                <span>Discover Our Stories</span>
                <ArrowRight />
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="my-12 border-t border-white/50"></div>

          {/* Copyright & Payment Icons */}
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <p className="text-center text-sm text-white md:text-left">
              Copyright © 2025 – Shirley&apos;s Foods a company of SS World Ltd
              and the Shirley&apos;s brand – All Rights Reserved.
            </p>

            <PaymentIcons />
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-white/50"></div>

          {/* Bottom Logo and Social Icons */}
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            {/* Small Logo */}
            <div className="h-12 w-12">
              <Image
                src="/image/logo_c_white.png"
                alt="Shirley's Logo"
                width={41}
                height={68}
              />
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <Link
                href="https://www.facebook.com/shirleysfoods/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                  <FaFacebook size={20} />
                </div>
              </Link>
              <Link
                href="https://www.instagram.com/shirleysjollofpaste/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                  <FaSquareInstagram size={20} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
