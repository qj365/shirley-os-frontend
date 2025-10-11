"use client"

import React from 'react'
import Image from 'next/image'

interface TestimonialData {
  quote: string
  author: string
  location: string
  avatar: string
}

const testimonialData: TestimonialData = {
  quote: "I had the pleasure of trying this Jollof Rice, and it was nothing short of amazing! The flavours were rich and perfectly balanced, with just the right amount of spice.",
  author: "David O.",
  location: "Manchester",
  avatar: "/image/davido.png"
}

export default function RecipeTestimonial() {
  return (
    <section className="relative py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background with wavy border */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgb(255, 240, 205)' }}>
        {/* Wavy border image */}
        <Image
          src="/image/testimony-vector.png"
          alt="Decorative wavy border"
          fill
          className="object-cover"
        />
      </div>
      
      {/* Content container */}
      <div className="relative max-w-7xl mx-auto">
        {/* Section title */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black px-4"
            style={{ fontFamily: 'Raleway' }}
          >
            Love by individuals across the globe
          </h2>
        </div>
        
        {/* Testimonial card */}
        <div className="flex justify-center">
          <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 max-w-4xl w-full relative mx-4">
            {/* Quote icon */}
            <div className="absolute -top-6 sm:-top-8 lg:-top-9 left-4 sm:left-6 lg:left-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-18 lg:h-18 bg-black rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 lg:w-10 lg:h-10" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.75 26.25V21C15.75 18.515 17.765 16.5 20.25 16.5H21V14.25C21 12.595 19.655 11.25 18 11.25H15.75C14.095 11.25 12.75 12.595 12.75 14.25V26.25H15.75ZM29.25 26.25V21C29.25 18.515 31.265 16.5 33.75 16.5H34.5V14.25C34.5 12.595 33.155 11.25 31.5 11.25H29.25C27.595 11.25 26.25 12.595 26.25 14.25V26.25H29.25Z" fill="white"/>
                </svg>
              </div>
            </div>
            
            {/* Testimonial content */}
            <div className="pt-6 sm:pt-8">
              <blockquote 
                className="text-sm sm:text-base lg:text-lg leading-relaxed text-black mb-6 sm:mb-8"
                style={{ fontFamily: 'Raleway' }}
              >
                &ldquo;{testimonialData.quote}&rdquo;
              </blockquote>
              
              {/* Author info */}
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-3 sm:mr-4">
                  <Image
                    src={testimonialData.avatar}
                    alt={testimonialData.author}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div 
                    className="font-semibold text-black text-sm sm:text-base"
                    style={{ fontFamily: 'Raleway' }}
                  >
                    {testimonialData.author}
                  </div>
                  <div 
                    className="text-gray-600 text-xs sm:text-sm"
                    style={{ fontFamily: 'Raleway' }}
                  >
                    {testimonialData.location}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}