"use client"

import React from 'react'

export default function WholesaleHeroSection() {
  return (
    <div 
      className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[703px] bg-cover bg-center"
      style={{
        backgroundImage: "url('/image/wholesaleHero.jpg')",
      }}
    >
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4 mt-[50px] relative z-10">
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-[100%] drop-shadow-lg">
            Premium West African Flavours for <br/> Your Business
          </h1>
          
          <p className="text-base md:text-xl lg:text-2xl text-white font-medium w-full sm:w-[80%] md:w-[70%] drop-shadow-md">
            From Traditional Classics To Modern Interpretations, Each Dish Celebrates The Rich Culinary Heritage of West Africa, Whilst Offering Simplicity And Convenience
          </p>
        </div>
      </div>
    </div>
  )
}

