import React from 'react'
import Image from 'next/image'
import { Recipe, wholesalerecipe } from '@/constants/wholesale-data/wholesale-recipe-data'
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

function WholeSaleRecipes({ color, card, showButton }: { color: string; card: number;showButton: boolean }) {

  return (
    <section className="w-full bg-[${color}]  mx-auto px-4   py-8 sm:py-10 md:py-12"
    style={{ backgroundColor: color }}
    >
      {/* Header section */}
      <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 text-center mb-8 sm:mb-12 md:mb-[114px]">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-[100%]">
          Our Recipes
        </h1>

        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-black font-medium max-w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%]">
          From Traditional Classics To Modern Interpretations, Each <br className="hidden sm:block" /> 
          Dish Celebrates The Rich Culinary Heritage of West Africa,<br className="hidden sm:block" /> 
          Whilst Offering Simplicity And Convenience
        </p>
      </div>

      {/* Recipe grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10">
        {wholesalerecipe.slice(0, card).map((item: Recipe, index: number) => (
          <ProductCard 
            item={item} 
            key={index} 
            hideOnMd={index === 2} // Add condition to hide card at index 2 on md screens
          />
        ))}
      </div>
      <div className='flex justify-center  mt-[56px]'>
      {/* Show more button */}
      {showButton && (
         <Link
         href="/shop"
         className="flex items-center gap-2 bg-black text-white shadow-inner rounded-full px-8 py-4 w-fit text-xl font-medium"
       >
         View All
         <ArrowRight className="h-6 w-6" />
       </Link>
      )}
      </div>
    </section>
  )
}

const ProductCard = ({ item, hideOnMd }: { item: Recipe, hideOnMd: boolean }) => (
  <div className={`bg-[#EEEEEE] rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden flex flex-col h-full transition-transform duration-300 hover:scale-[1.02] ${hideOnMd ? 'hidden lg:block' : ''}`}>
    {/* Image */}
    <div className="w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] overflow-hidden">
      <Image
        src={item.image}
        alt={item.name}
        width={500}
        height={240}
        className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
        priority={false}
      />
    </div>

    {/* Content */}
    <div className="p-3 sm:p-4">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-black">
        {item.name}
      </h3>
    </div>
  </div>
)

export default WholeSaleRecipes
