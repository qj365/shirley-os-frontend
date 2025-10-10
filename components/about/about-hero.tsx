
"use client"
import React from "react";

export default function AboutHero() {
  return (
    <div
      className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[703px] bg-cover bg-center"
      style={{
        backgroundImage: "url('/image/aboutImages/aboutHeroImage.jpeg')",
      }}
    >
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="top-[35%] w-full px-4 relative z-10">
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 text-center">
          <h1 className="text-xl sm:text-xl md:text-4xl font-bold text-white leading-[100%] drop-shadow-lg">
            Premium West African Flavours for Your Business
          </h1>

          <p className="text-base sm:text-base md:text-xl lg:text-2xl text-white font-medium max-w-[90%] sm:max-w-[80%] md:max-w-[70%] drop-shadow-md">
            From Traditional Classics To Modern Interpretations, Each Dish Celebrates The Rich Culinary Heritage of West Africa, Whilst Offering Simplicity And Convenience
          </p>
        </div>
      </div>
    </div>
  );
}
