"use client"

import React from 'react'
import Image from 'next/image'
import { Recipe } from '@/constants/recipe-data/recipes'

interface RecipeHeroProps {
  recipe: Recipe
}

const RecipeHero = ({ recipe }: RecipeHeroProps) => {
  return (
    <>
      {/* Hero Banner Section */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24">
        {/* Rounded Rectangle Background */}
        <div className="relative w-full h-[250px] sm:h-[350px] lg:h-[450px] rounded-[15px] overflow-hidden mt-8 sm:mt-12 lg:mt-15">
          {/* Recipe Image */}
          <Image
            src={recipe.heroImage}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Recipe Title and Meta Info */}
        <div className="mt-6 sm:mt-8 lg:mt-[50px]">
          {/* Recipe Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-black font-raleway leading-tight sm:leading-[45px] lg:leading-[60px] mb-8 sm:mb-12 lg:mb-[64px]">
            {recipe.title}
          </h1>
        
          {/* Recipe Meta Information */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-start lg:justify-between gap-4 sm:gap-6 lg:gap-[100px]">
            {/* Serving Info */}
            <div className="flex items-center gap-[8px] sm:gap-[12px]">
              <div className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] bg-[#FFEDC3] rounded-full flex items-center justify-center">
                <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3.33C8.16 3.33 6.67 4.82 6.67 6.67C6.67 8.51 8.16 10 10 10C11.84 10 13.33 8.51 13.33 6.67C13.33 4.82 11.84 3.33 10 3.33ZM10 13.33C6.67 13.33 3.33 15 3.33 16.67V18.33H16.67V16.67C16.67 15 13.33 13.33 10 13.33Z" fill="#FFC020"/>
                </svg>
              </div>
              <div>
                <p className="text-[#7C7C7C] text-sm sm:text-base lg:text-[18px] font-semibold font-raleway">Serving</p>
                <p className="text-black text-base sm:text-lg lg:text-[20px] font-bold font-raleway">{recipe.metaInfo.serves}</p>
              </div>
            </div>
          
             {/* Cook Time */}
             <div className="flex items-center gap-[8px] sm:gap-[12px]">
               <div className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] bg-[#FFEDC3] rounded-full flex items-center justify-center">
                 <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="none">
                   <path d="M10 1.67C5.4 1.67 1.67 5.4 1.67 10S5.4 18.33 10 18.33 18.33 14.6 18.33 10 14.6 1.67 10 1.67ZM10 16.67C6.32 16.67 3.33 13.68 3.33 10S6.32 3.33 10 3.33 16.67 6.32 16.67 10 13.68 16.67 10 16.67ZM10.83 5H9.17V10.42L14.17 13.2L15 11.8L10.83 9.58V5Z" fill="#FFC020"/>
                 </svg>
               </div>
               <div>
                 <p className="text-[#7C7C7C] text-sm sm:text-base lg:text-[18px] font-semibold font-raleway">Cook Time</p>
                 <p className="text-black text-base sm:text-lg lg:text-[20px] font-bold font-raleway">{recipe.metaInfo.cookTime}</p>
               </div>
             </div>
          
             {/* Cuisine */}
             <div className="flex items-center gap-[8px] sm:gap-[12px]">
               <div className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] bg-[#FFEDC3] rounded-full flex items-center justify-center">
                 <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="none">
                   <path d="M10 1.67L12.5 7.5L18.33 8.33L14.17 12.5L15 18.33L10 15.83L5 18.33L5.83 12.5L1.67 8.33L7.5 7.5L10 1.67Z" fill="#FFC020"/>
                 </svg>
               </div>
               <div>
                 <p className="text-[#7C7C7C] text-sm sm:text-base lg:text-[18px] font-semibold font-raleway">Cuisine</p>
                 <p className="text-black text-base sm:text-lg lg:text-[20px] font-bold font-raleway">{recipe.metaInfo.cuisine}</p>
               </div>
             </div>
             
             {/* Difficulty */}
             <div className="flex items-center gap-[8px] sm:gap-[12px]">
               <div className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] bg-[#FFEDC3] rounded-full flex items-center justify-center">
                 <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="none">
                   <path d="M10 1.67L12.5 7.5L18.33 8.33L14.17 12.5L15 18.33L10 15.83L5 18.33L5.83 12.5L1.67 8.33L7.5 7.5L10 1.67Z" fill="#FFC020"/>
                 </svg>
               </div>
               <div>
                 <p className="text-[#7C7C7C] text-sm sm:text-base lg:text-[18px] font-semibold font-raleway">Difficulty</p>
                 <p className="text-black text-base sm:text-lg lg:text-[20px] font-bold font-raleway">{recipe.metaInfo.difficulty}</p>
               </div>
             </div>
             
             {/* Prep Time */}
             <div className="flex items-center gap-[8px] sm:gap-[12px]">
               <div className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] bg-[#FFEDC3] rounded-full flex items-center justify-center">
                 <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="none">
                   <path d="M10 1.67C5.4 1.67 1.67 5.4 1.67 10S5.4 18.33 10 18.33 18.33 14.6 18.33 10 14.6 1.67 10 1.67ZM10 16.67C6.32 16.67 3.33 13.68 3.33 10S6.32 3.33 10 3.33 16.67 6.32 16.67 10 13.68 16.67 10 16.67ZM10.83 5H9.17V10.42L14.17 13.2L15 11.8L10.83 9.58V5Z" fill="#FFC020"/>
                 </svg>
               </div>
               <div>
                 <p className="text-[#7C7C7C] text-sm sm:text-base lg:text-[18px] font-semibold font-raleway">Prep Time</p>
                 <p className="text-black text-base sm:text-lg lg:text-[20px] font-bold font-raleway">{recipe.metaInfo.prep}</p>
               </div>
             </div>
        </div>
        </div>
      </div>
    </>
  )
}

export default RecipeHero