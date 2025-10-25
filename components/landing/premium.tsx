import { premiumData, PremiumType } from '@/constants/landing/premium';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Premium() {
  // Function to generate the appropriate URL for each premium product
  const getPremiumUrl = (item: PremiumType) => {
    // Map the premium product titles to appropriate category parameters
    if (item.title === "Shirley's Jollof Paste") {
      return '/shop?category=Jollof%20Paste';
    } else if (item.title === "Shirley's Red Sauce") {
      return '/shop?category=Red%20Sauce';
    }
    // Default fallback
    return `/shop?category=${encodeURIComponent(item.title)}`;
  };

  return (
    <section className="mx-auto mb-28 w-full px-6 py-12 md:py-24 lg:w-[60%]">
      <div className="mb-16 text-center md:mb-24">
        <h2 className="mb-6 text-3xl font-bold md:text-4xl">
          Premium Products, Authentic <br /> Flavours
        </h2>
        <p className="mx-auto max-w-4xl text-lg text-gray-800 md:text-xl">
          Our carefully crafted range maintains the depth and complexity of
          traditional West African cuisine while offering unparalleled
          convenience.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {premiumData.map((item: PremiumType, index: number) => {
            return (
              <Link href={getPremiumUrl(item)} key={index}>
                <div className="relative flex h-full cursor-pointer flex-col items-center justify-center">
                  {/* Circular image container with responsive sizing */}
                  <div className="absolute top-0 flex w-full justify-center">
                    <div className="flex aspect-square w-3/4 items-center justify-center overflow-hidden rounded-full border-[10px] border-[#FFC020] md:w-2/3 lg:w-3/4">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={500}
                        height={500}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  </div>

                  {/* Card with responsive padding and sizing */}
                  <div className="mt-[37.5%] flex w-full flex-1 flex-col items-center justify-between rounded-xl border-2 border-gray-100 bg-white px-4 pt-[calc(37.5%+2rem)] pb-6 text-center md:px-6">
                    <h3 className="text-xl font-bold md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-base text-gray-700 md:text-lg">
                      {item.para}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Premium;
