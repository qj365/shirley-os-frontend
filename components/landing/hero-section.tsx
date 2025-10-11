"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star, Sparkles } from "lucide-react"

function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentDishIndex, setCurrentDishIndex] = useState(0)
  const heroRef = useRef<HTMLElement>(null)

  // Array of dish images
  const dishImages = [
    "/image/dishes/dish1.png",
    "/image/dishes/dish2.png", 
    "/image/dishes/dish3.png",
    "/image/dishes/dish4.png",
    "/image/dishes/dish5.png",
    "/image/dishes/dish6.png",
    "/image/dishes/dish9.png"
  ]

  // Dish names for better accessibility
  const dishNames = [
    "Jollof Rice + Marinated Chicken",
    "Spicy Vegatable Jollof Stew with Couscous", 
    "Traditional Jollof Rice",
    "Seafood Jollof Stew",
    "Traditional Marinated Fish with Banku",
    "Marinated Chicken with Banku",
    "Marinated Beef Stew with Banku"
  ]

  // Rotating dish effect - changes every 4 seconds
  useEffect(() => {
    const dishRotationTimer = setInterval(() => {
      setCurrentDishIndex((prevIndex) => (prevIndex + 1) % dishImages.length)
    }, 4000) // 4 seconds interval

    return () => clearInterval(dishRotationTimer)
  }, [dishImages.length])

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        setMousePosition({ x, y })
      }
    }

    const heroElement = heroRef.current
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove)
      return () => heroElement.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen 2xl:min-h-0 overflow-hidden bg-gradient-to-br from-[#FFFBF2] via-[#FFF8E7] to-[#FFFBF2]"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Spices */}
        <div 
          className="absolute top-20 left-10 w-8 h-8 opacity-20 animate-bounce"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 10}px)`,
            animationDelay: '0s',
            animationDuration: '3s'
          }}
        >
          <Image src="/image/landingPageImages/ing1.png" alt="" fill className="object-contain" />
        </div>
        <div 
          className="absolute top-40 right-20 w-6 h-6 opacity-15 animate-bounce"
          style={{
            transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * 8}px)`,
            animationDelay: '1s',
            animationDuration: '4s'
          }}
        >
          <Image src="/image/landingPageImages/ing2.png" alt="" fill className="object-contain" />
        </div>
        <div 
          className="absolute bottom-32 left-20 w-10 h-10 opacity-10 animate-bounce"
          style={{
            transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * -12}px)`,
            animationDelay: '2s',
            animationDuration: '5s'
          }}
        >
          <Image src="/image/landingPageImages/ing3.png" alt="" fill className="object-contain" />
        </div>
        
        {/* Floating Sparkles */}
        <div className="absolute top-1/4 left-1/4 animate-pulse">
          <Sparkles className="w-4 h-4 text-[#F3C03F] opacity-30" />
        </div>
        <div className="absolute top-3/4 right-1/3 animate-pulse" style={{ animationDelay: '1.5s' }}>
          <Star className="w-3 h-3 text-[#FFBA0A] opacity-25" />
        </div>
        <div className="absolute top-1/2 left-1/6 animate-pulse" style={{ animationDelay: '3s' }}>
          <Sparkles className="w-5 h-5 text-[#F3C03F] opacity-20" />
        </div>
      </div>

      {/* Remove the top padding that was causing excessive space */}
      <div className="sm:px-6 pt-32 sm:pt-36 md:pt-40 lg:pt-35 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-10 2xl:gap-8 3xl:gap-6 4xl:gap-4 items-start justify-center min-h-[calc(100vh-8rem)] 2xl:min-h-0 2xl:py-16 max-w-screen-4xl mx-auto 3xl:max-w-[60%] 4xl:max-w-[45%]">
          {/* Left Content */}
          <div className="flex flex-col justify-center gap-4 md:gap-6 lg:gap-8 order-2 lg:order-1 z-10 relative px-4 sm:px-0">
            {/* Brand Badge */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-2 mb-2">
              <div className="bg-gradient-to-r from-[#F3C03F] to-[#FFBA0A] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                🌟 #1 Authentic Jollof
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F3C03F] text-[#F3C03F]" />
                ))}
                <span className="text-sm text-[#6B7280] ml-1">(2,500+ reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 3xl:text-8xl 4xl:text-[6.5rem] font-bold leading-tight text-[#262B2E] max-w-4xl 4xl:max-w-5xl">
              <span className="text-[#262B2E]">
                Experience the rich tradition of Jollof rice with none of the complexity.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl 3xl:text-2xl 4xl:text-3xl text-[#6B7280] max-w-xl 4xl:max-w-3xl leading-relaxed">
              🍚 Authentic West African flavours ready in minutes. No prep, no mess, just pure deliciousness.
            </p>

            {/* Features List */}
            <div className="flex flex-wrap gap-3 md:gap-4 my-4 4xl:my-6">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full shadow-md">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs md:text-sm 4xl:text-base font-medium text-[#262B2E]">Ready in 35 minutes</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full shadow-md">
                <div className="w-2 h-2 bg-[#F3C03F] rounded-full"></div>
                <span className="text-xs md:text-sm 4xl:text-base font-medium text-[#262B2E]">100% Natural</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full shadow-md">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs md:text-sm 4xl:text-base font-medium text-[#262B2E]">Authentic Recipe</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row mb-2 gap-3 md:gap-4">
              <Link
                href="/shop"
                className="group flex items-center gap-3 bg-[#F3C03F] 
                         border border-[#F3C03F] shadow-lg rounded-full px-6 md:px-8 py-3 md:py-4 w-fit 
                         text-base md:text-lg 4xl:text-xl font-semibold transition-all duration-200 text-[#262B2E]
                         hover:shadow-xl hover:bg-[#FFBA0A] relative z-20"
              >
                <span className="relative z-10">Shop Now</span>
                <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
              </Link>
              
              {/* <button className="flex items-center gap-3 bg-white/90 backdrop-blur-sm border-2 border-[#F3C03F] 
                               rounded-full px-5 md:px-6 py-3 md:py-4 w-fit text-base md:text-lg font-semibold transition-all duration-200 
                               text-[#262B2E] hover:bg-[#F3C03F] hover:text-white">
                <Play className="h-4 w-4 md:h-5 md:w-5" />
                Watch Story
              </button> */}
            </div>
          </div>

          {/* Right Visual Content - Responsive Refactor */}
          <div className="relative order-1 lg:order-2 flex items-start lg:items-start justify-center lg:pt-8 xl:pt-4 3xl:pt-0 4xl:pt-0 4xl:pl-0">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl 3xl:max-w-5xl 4xl:max-w-[850px] aspect-square mx-auto">
              {/* Container for all circular elements */} 
              <div className="relative w-full h-full">
                
                {/* Static Background Circle - Outermost */}
                <div className="absolute inset-0 w-full h-full">
                  <div 
                    className="w-full h-full rounded-full opacity-15 4xl:scale-125"
                    style={{
                      background: 'conic-gradient(from 0deg, #F3C03F, #FFBA0A, #F3C03F)'
                    }}
                  ></div>
                </div>

                {/* Static Outer Ring - Second layer */}
                <div className="absolute top-[4%] left-[4%] w-[92%] h-[92%] 4xl:top-[3%] 4xl:left-[3%] 4xl:w-[94%] 4xl:h-[94%]">
                  <div 
                    className="w-full h-full rounded-full border-3 4xl:border-4"
                    style={{
                      borderColor: '#FFC020',
                      borderStyle: 'dashed'
                    }}
                  ></div>
                </div>

                {/* Main Yellow Circular Background - Third layer */}
                <div className="absolute top-[8%] left-[8%] w-[84%] h-[84%] 4xl:top-[6%] 4xl:left-[6%] 4xl:w-[88%] 4xl:h-[88%] transition-all duration-300">
                  <div 
                    className="w-full h-full rounded-full relative overflow-hidden"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, #FFBA0A 0%, #F3C03F 50%, #E5A401 100%)',
                    }}
                  >
                    {/* Static shine effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    
                    {/* Rotating Dish Images - Innermost layer */}
                    <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] z-20">
                      <div className="w-full h-full relative rounded-full overflow-hidden shadow-2xl">
                        {/* Render all dish images with fade transitions */}
                        {dishImages.map((dishSrc, index) => (
                          <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                              index === currentDishIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                          >
                            <Image
                              src={dishSrc}
                              alt={dishNames[index]}
                              fill
                              className="object-cover"
                              priority={index === 0} // Only prioritize the first image
                            />
                          </div>
                        ))}
                        {/* Overlay gradient for depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Leaf - Top Left, Bigger and Closer */}
                <div className="absolute top-4 left-4 w-16 h-16 md:w-18 md:h-18 lg:w-25 lg:h-25 4xl:w-32 4xl:h-32 z-30">
                  <div className="w-full h-full relative drop-shadow-lg">
                    <Image
                      src="/image/landingPageImages/leaf.png"
                      alt="Fresh leaf"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Additional Floating Spices */}
                <div className="absolute top-16 left-16 w-8 h-8 md:w-10 md:h-10 4xl:w-14 4xl:h-14 4xl:top-20 4xl:left-20 z-25">
                  <div className="w-full h-full relative drop-shadow-md">
                    <Image
                      src="/image/landingPageImages/ing4.png"
                      alt="Spice"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="absolute bottom-16 right-16 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 4xl:w-16 4xl:h-16 4xl:bottom-20 4xl:right-20 z-25">
                  <div className="w-full h-full relative drop-shadow-md">
                    <Image
                      src="/image/landingPageImages/yellowLeaf.png"
                      alt="Golden leaf"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Interactive Floating Text - Responsive and Dynamic */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 md:px-3 md:py-2 4xl:px-4 4xl:py-3 rounded-full shadow-lg z-30">
                  <span className="text-xs 4xl:text-sm font-semibold text-[#262B2E]">🔥 Hot & Fresh</span>
                </div>
                
                <div className="absolute bottom-7 md:bottom-2 left-2 bg-gradient-to-r from-[#F3C03F] to-[#FFBA0A] text-white px-2 py-1 md:px-3 md:py-2 4xl:px-4 4xl:py-3 rounded-full shadow-lg z-30">
                  <span className="text-xs 4xl:text-sm font-semibold">⚡ 35 Min Ready</span>
                </div>

                {/* Dynamic Dish Name Indicator */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-3 py-2 4xl:px-5 4xl:py-3 rounded-full shadow-lg z-30 transition-all duration-500 2xl:bottom-0 4xl:bottom-2">
                  <span className="text-xs 4xl:text-sm font-semibold text-[#262B2E] whitespace-nowrap">
                    {dishNames[currentDishIndex]}
                  </span>
                </div>

                {/* Dish Progress Dots */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 hidden md:flex space-x-1 z-30 2xl:-bottom-8">
                  {dishImages.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        index === currentDishIndex 
                          ? 'bg-[#F3C03F] scale-125' 
                          : 'bg-[#F3C03F]/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Vertical Navigation - Simplified Design */}
      <div className="hidden lg:block absolute right-4 top-1/2 transform -translate-y-1/2 z-40">
        <div className="relative">
          {/* Simple Vertical Line */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-transparent via-[#F3C03F]/30 to-transparent transform -translate-x-1/2"></div>
          
          {/* Navigation Items */}
          <div className="relative space-y-8 py-6">
            {[
              { label: 'Education', icon: '📚' },
              { label: 'Story', icon: '📖' },
              { label: 'Classes', icon: '👨‍🍳' }
            ].map((item) => (
              <div 
                key={item.label}
                className="group/item relative flex items-center justify-center cursor-pointer"
              >
                {/* Icon Circle */}
                <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border-2 border-[#F3C03F]/20 flex items-center justify-center shadow-md transition-all duration-300 hover:bg-[#F3C03F] hover:scale-110 group-hover/item:border-[#F3C03F]">
                  <span className="text-sm transition-all duration-300 group-hover/item:scale-110">{item.icon}</span>
                </div>
                
                {/* Label on Hover */}
                <div className="absolute left-12 bg-[#262B2E] text-white px-2 py-1 rounded text-xs opacity-0 group-hover/item:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Social Proof Badge */}
        <div className="absolute -bottom-12 -left-6 2xl:-bottom-8 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-0.5 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-[#F3C03F] text-[#F3C03F]" />
              ))}
            </div>
            <p className="text-xs font-bold text-[#262B2E]">14K+</p>
            <p className="text-xs text-[#262B2E]/70">Happy Customers</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection