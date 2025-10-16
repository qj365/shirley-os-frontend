import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Back to home arrow */}
      <div className="absolute z-10 p-4">
        <Link
          href="/"
          className="flex items-center text-gray-600 transition-colors hover:text-black"
        >
          <ArrowLeft size={20} />
          <span className="ml-2">Back to home</span>
        </Link>
      </div>

      <div className="flex h-screen flex-1 flex-col md:flex-row">
        {/* Form section */}
        <div className="flex w-full items-center justify-center p-8 pt-16 lg:w-1/2">
          {children}
        </div>

        {/* Image section */}
        <div className="relative hidden w-full lg:block lg:w-1/2">
          <Image
            src="/image/login.png"
            alt="login"
            layout="fill"
            objectFit="cover"
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
