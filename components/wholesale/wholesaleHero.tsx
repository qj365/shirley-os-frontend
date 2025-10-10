'use client';

import React from 'react';

export default function WholesaleHeroSection() {
  return (
    <div
      className="relative h-[300px] w-full bg-cover bg-center sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[703px]"
      style={{
        backgroundImage: "url('/image/wholesaleHero.jpg')",
      }}
    >
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="absolute top-1/2 left-1/2 z-10 mt-[50px] w-full -translate-x-1/2 -translate-y-1/2 px-4">
        <div className="flex flex-col items-center gap-4 text-center sm:gap-6 md:gap-8">
          <h1 className="text-2xl leading-[100%] font-bold text-white drop-shadow-lg sm:text-3xl md:text-4xl">
            Premium West African Flavours for <br /> Your Business
          </h1>

          <p className="w-full text-base font-medium text-white drop-shadow-md sm:w-[80%] md:w-[70%] md:text-xl lg:text-2xl">
            From Traditional Classics To Modern Interpretations, Each Dish Celebrates The Rich
            Culinary Heritage of West Africa, Whilst Offering Simplicity And Convenience
          </p>
        </div>
      </div>
    </div>
  );
}
