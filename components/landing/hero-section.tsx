'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Sparkles } from 'lucide-react';

function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentDishIndex, setCurrentDishIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  // Array of dish images
  const dishImages = [
    '/image/dishes/dish1.png',
    '/image/dishes/dish2.png',
    '/image/dishes/dish3.png',
    '/image/dishes/dish4.png',
    '/image/dishes/dish5.png',
    '/image/dishes/dish6.png',
    '/image/dishes/dish9.png',
  ];

  // Dish names for better accessibility
  const dishNames = [
    'Jollof Rice + Marinated Chicken',
    'Spicy Vegatable Jollof Stew with Couscous',
    'Traditional Jollof Rice',
    'Seafood Jollof Stew',
    'Traditional Marinated Fish with Banku',
    'Marinated Chicken with Banku',
    'Marinated Beef Stew with Banku',
  ];

  // Rotating dish effect - changes every 4 seconds
  useEffect(() => {
    const dishRotationTimer = setInterval(() => {
      setCurrentDishIndex(prevIndex => (prevIndex + 1) % dishImages.length);
    }, 4000); // 4 seconds interval

    return () => clearInterval(dishRotationTimer);
  }, [dishImages.length]);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () =>
        heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FFFBF2] via-[#FFF8E7] to-[#FFFBF2] 2xl:min-h-0"
    >
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Floating Spices */}
        <div
          className="absolute top-20 left-10 h-8 w-8 animate-bounce opacity-20"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 10}px)`,
            animationDelay: '0s',
            animationDuration: '3s',
          }}
        >
          <Image
            src="/image/landingPageImages/ing1.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div
          className="absolute top-40 right-20 h-6 w-6 animate-bounce opacity-15"
          style={{
            transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * 8}px)`,
            animationDelay: '1s',
            animationDuration: '4s',
          }}
        >
          <Image
            src="/image/landingPageImages/ing2.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div
          className="absolute bottom-32 left-20 h-10 w-10 animate-bounce opacity-10"
          style={{
            transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * -12}px)`,
            animationDelay: '2s',
            animationDuration: '5s',
          }}
        >
          <Image
            src="/image/landingPageImages/ing3.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Floating Sparkles */}
        <div className="absolute top-1/4 left-1/4 animate-pulse">
          <Sparkles className="h-4 w-4 text-[#F3C03F] opacity-30" />
        </div>
        <div
          className="absolute top-3/4 right-1/3 animate-pulse"
          style={{ animationDelay: '1.5s' }}
        >
          <Star className="h-3 w-3 text-[#FFBA0A] opacity-25" />
        </div>
        <div
          className="absolute top-1/2 left-1/6 animate-pulse"
          style={{ animationDelay: '3s' }}
        >
          <Sparkles className="h-5 w-5 text-[#F3C03F] opacity-20" />
        </div>
      </div>

      {/* Remove the top padding that was causing excessive space */}
      <div className="relative z-10 pt-32 sm:px-6 sm:pt-36 md:pt-40 lg:pt-35">
        <div className="3xl:gap-6 4xl:gap-4 relative container grid min-h-[calc(100vh-8rem)] items-start justify-center gap-6 md:gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-10 2xl:min-h-0 2xl:gap-8 2xl:py-16">
          {/* Left Content */}
          <div className="relative z-10 order-2 flex flex-col justify-center gap-4 sm:px-0 md:gap-6 lg:order-1 lg:gap-8">
            {/* Brand Badge */}
            <div className="mb-2 flex flex-col items-center gap-2 sm:flex-row lg:items-start">
              <div className="rounded-full bg-gradient-to-r from-[#F3C03F] to-[#FFBA0A] px-4 py-2 text-sm font-semibold text-white shadow-lg">
                🌟 #1 Authentic Jollof
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-[#F3C03F] text-[#F3C03F]"
                  />
                ))}
                <span className="ml-1 text-sm text-[#6B7280]">
                  (2,500+ reviews)
                </span>
              </div>
            </div>

            <h1 className="3xl:text-8xl 4xl:text-[6.5rem] 4xl:max-w-5xl max-w-4xl text-3xl leading-tight font-bold text-[#262B2E] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              <span className="text-[#262B2E]">
                Experience the rich tradition of Jollof rice with none of the
                complexity.
              </span>
            </h1>

            <p className="3xl:text-2xl 4xl:text-3xl 4xl:max-w-3xl max-w-xl text-base leading-relaxed text-[#6B7280] sm:text-lg md:text-xl">
              🍚 Authentic West African flavours ready in minutes. No prep, no
              mess, just pure deliciousness.
            </p>

            {/* Features List */}
            <div className="4xl:my-6 my-4 flex flex-wrap gap-3 md:gap-4">
              <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-md backdrop-blur-sm md:px-4">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="4xl:text-base text-xs font-medium text-[#262B2E] md:text-sm">
                  Ready in 35 minutes
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-md backdrop-blur-sm md:px-4">
                <div className="h-2 w-2 rounded-full bg-[#F3C03F]"></div>
                <span className="4xl:text-base text-xs font-medium text-[#262B2E] md:text-sm">
                  100% Natural
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-md backdrop-blur-sm md:px-4">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="4xl:text-base text-xs font-medium text-[#262B2E] md:text-sm">
                  Authentic Recipe
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mb-2 flex flex-col gap-3 sm:flex-row md:gap-4">
              <Link
                href="/shop"
                className="group 4xl:text-xl relative z-20 flex w-fit items-center gap-3 rounded-full border border-[#F3C03F] bg-[#F3C03F] px-6 py-3 text-base font-semibold text-[#262B2E] shadow-lg transition-all duration-200 hover:bg-[#FFBA0A] hover:shadow-xl md:px-8 md:py-4 md:text-lg"
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
          <div className="3xl:pt-0 4xl:pt-0 4xl:pl-0 relative order-1 flex items-start justify-center lg:order-2 lg:items-start lg:pt-8 xl:pt-4">
            <div className="3xl:max-w-5xl 4xl:max-w-[850px] relative mx-auto aspect-square w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
              {/* Container for all circular elements */}
              <div className="relative h-full w-full">
                {/* Static Background Circle - Outermost */}
                <div className="absolute inset-0 h-full w-full">
                  <div
                    className="4xl:scale-125 h-full w-full rounded-full opacity-15"
                    style={{
                      background:
                        'conic-gradient(from 0deg, #F3C03F, #FFBA0A, #F3C03F)',
                    }}
                  ></div>
                </div>

                {/* Static Outer Ring - Second layer */}
                <div className="4xl:top-[3%] 4xl:left-[3%] 4xl:w-[94%] 4xl:h-[94%] absolute top-[4%] left-[4%] h-[92%] w-[92%]">
                  <div
                    className="4xl:border-4 h-full w-full rounded-full border-3"
                    style={{
                      borderColor: '#FFC020',
                      borderStyle: 'dashed',
                    }}
                  ></div>
                </div>

                {/* Main Yellow Circular Background - Third layer */}
                <div className="4xl:top-[6%] 4xl:left-[6%] 4xl:w-[88%] 4xl:h-[88%] absolute top-[8%] left-[8%] h-[84%] w-[84%] transition-all duration-300">
                  <div
                    className="relative h-full w-full overflow-hidden rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle at 30% 30%, #FFBA0A 0%, #F3C03F 50%, #E5A401 100%)',
                    }}
                  >
                    {/* Static shine effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                    {/* Rotating Dish Images - Innermost layer */}
                    <div className="absolute top-[10%] left-[10%] z-20 h-[80%] w-[80%]">
                      <div className="relative h-full w-full overflow-hidden rounded-full shadow-2xl">
                        {/* Render all dish images with fade transitions */}
                        {dishImages.map((dishSrc, index) => (
                          <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                              index === currentDishIndex
                                ? 'opacity-100'
                                : 'opacity-0'
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
                        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 via-transparent to-white/10"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Leaf - Top Left, Bigger and Closer */}
                <div className="4xl:w-32 4xl:h-32 absolute top-4 left-4 z-30 h-16 w-16 md:h-18 md:w-18 lg:h-25 lg:w-25">
                  <div className="relative h-full w-full drop-shadow-lg">
                    <Image
                      src="/image/landingPageImages/leaf.png"
                      alt="Fresh leaf"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Additional Floating Spices */}
                <div className="4xl:w-14 4xl:h-14 4xl:top-20 4xl:left-20 absolute top-16 left-16 z-25 h-8 w-8 md:h-10 md:w-10">
                  <div className="relative h-full w-full drop-shadow-md">
                    <Image
                      src="/image/landingPageImages/ing4.png"
                      alt="Spice"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="4xl:w-16 4xl:h-16 4xl:bottom-20 4xl:right-20 absolute right-16 bottom-16 z-25 h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12">
                  <div className="relative h-full w-full drop-shadow-md">
                    <Image
                      src="/image/landingPageImages/yellowLeaf.png"
                      alt="Golden leaf"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Interactive Floating Text - Responsive and Dynamic */}
                <div className="4xl:px-4 4xl:py-3 absolute top-2 right-2 z-30 rounded-full bg-white/90 px-2 py-1 shadow-lg backdrop-blur-sm md:px-3 md:py-2">
                  <span className="4xl:text-sm text-xs font-semibold text-[#262B2E]">
                    🔥 Hot & Fresh
                  </span>
                </div>

                <div className="4xl:px-4 4xl:py-3 absolute bottom-7 left-2 z-30 rounded-full bg-gradient-to-r from-[#F3C03F] to-[#FFBA0A] px-2 py-1 text-white shadow-lg md:bottom-2 md:px-3 md:py-2">
                  <span className="4xl:text-sm text-xs font-semibold">
                    ⚡ 35 Min Ready
                  </span>
                </div>

                {/* Dynamic Dish Name Indicator */}
                <div className="4xl:px-5 4xl:py-3 4xl:bottom-2 absolute -bottom-4 left-1/2 z-30 -translate-x-1/2 transform rounded-full bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm transition-all duration-500 2xl:bottom-0">
                  <span className="4xl:text-sm text-xs font-semibold whitespace-nowrap text-[#262B2E]">
                    {dishNames[currentDishIndex]}
                  </span>
                </div>

                {/* Dish Progress Dots */}
                <div className="absolute -bottom-12 left-1/2 z-30 hidden -translate-x-1/2 transform space-x-1 md:flex 2xl:-bottom-8">
                  {dishImages.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                        index === currentDishIndex
                          ? 'scale-125 bg-[#F3C03F]'
                          : 'bg-[#F3C03F]/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Vertical Navigation - Simplified Design */}
          <div className="absolute top-1/2 right-4 z-40 hidden -translate-y-1/2 transform lg:block">
            <div className="relative">
              {/* Simple Vertical Line */}
              <div className="absolute top-0 left-1/2 h-full w-0.5 -translate-x-1/2 transform bg-gradient-to-b from-transparent via-[#F3C03F]/30 to-transparent"></div>

              {/* Navigation Items */}
              <div className="relative space-y-8 py-6">
                {[
                  { label: 'Education', icon: '📚' },
                  { label: 'Story', icon: '📖' },
                  { label: 'Classes', icon: '👨‍🍳' },
                ].map(item => (
                  <div
                    key={item.label}
                    className="group/item relative flex cursor-pointer items-center justify-center"
                  >
                    {/* Icon Circle */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#F3C03F]/20 bg-white/90 shadow-md backdrop-blur-sm transition-all duration-300 group-hover/item:border-[#F3C03F] hover:scale-110 hover:bg-[#F3C03F]">
                      <span className="text-sm transition-all duration-300 group-hover/item:scale-110">
                        {item.icon}
                      </span>
                    </div>

                    {/* Label on Hover */}
                    <div className="pointer-events-none absolute left-12 rounded bg-[#262B2E] px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-all duration-300 group-hover/item:opacity-100">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proof Badge */}
            <div className="absolute -bottom-12 -left-6 rounded-xl bg-white/95 p-3 backdrop-blur-sm 2xl:-bottom-8">
              <div className="text-center">
                <div className="mb-1 flex items-center justify-center space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-2.5 w-2.5 fill-[#F3C03F] text-[#F3C03F]"
                    />
                  ))}
                </div>
                <p className="text-xs font-bold text-[#262B2E]">14K+</p>
                <p className="text-xs text-[#262B2E]/70">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
