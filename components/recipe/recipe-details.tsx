"use client"

import React from 'react'
import { Recipe } from '@/constants/recipe-data/recipes'

interface RecipeDetailsProps {
  recipe: Recipe
}

const RecipeDetails = ({ recipe }: RecipeDetailsProps) => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      {/* Ingredients Section */}
      <div className="mb-8 sm:mb-10 lg:mb-[50px]">
        <div className="bg-white rounded-[15px] border border-[#CECECE] w-full px-4 sm:px-6 lg:px-[20px] py-4 sm:py-6 lg:py-[20px]">
          <h2 className="text-xl sm:text-2xl lg:text-[25px] font-bold text-black mb-4 sm:mb-6 lg:mb-[20px] font-raleway">What you&apos;ll need:</h2>
          <div className="space-y-3 sm:space-y-4 lg:space-y-[20px]">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index}>
                <span className="text-base sm:text-lg lg:text-[20px] font-raleway">
                  • {ingredient}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="mb-8 sm:mb-10 lg:mb-[50px]">
        <h2 className="text-xl sm:text-2xl lg:text-[25px] font-bold text-black mb-6 sm:mb-8 lg:mb-[30px] font-raleway">Let&apos;s cook together:</h2>
        <div className="space-y-4 sm:space-y-6 lg:space-y-[25px]">
          {recipe.instructions.map((instruction, index) => (
            <div key={index}>
              <div className="bg-[#F7F7F7] rounded-[20px] p-4 sm:p-6 lg:p-[20px] flex flex-col sm:flex-row items-start">
                <div className="text-3xl sm:text-4xl lg:text-[60px] font-bold font-raleway bg-gradient-to-b text-black bg-clip-text mb-3 sm:mb-0 sm:mr-4 lg:mr-5 self-start">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl lg:text-[20px] font-bold font-raleway text-black mb-2 sm:mb-3 lg:mb-[10px]">
                    {instruction.title}
                  </h3>
                  <p className="text-base sm:text-lg lg:text-[18px] font-raleway text-black">
                    {instruction.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chef's Tips Section */}
      {recipe.chefTips && recipe.chefTips.length > 0 && (
        <div className="mb-8 sm:mb-10 lg:mb-[50px]">
          <div className="bg-white rounded-[15px] border border-[#CECECE] w-full px-4 sm:px-6 lg:px-[20px] py-4 sm:py-6 lg:py-[20px]">
            <h2 className="text-xl sm:text-2xl lg:text-[25px] font-bold text-black mb-4 sm:mb-6 lg:mb-[20px] font-raleway">Chef&apos;s Tips:</h2>
            <div className="space-y-3 sm:space-y-4 lg:space-y-[15px]">
              {recipe.chefTips.map((tip, index) => (
                <div key={index}>
                  <span className="text-base sm:text-lg lg:text-[18px] font-raleway text-black">
                    • {tip}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Perfect Pairings Section */}
      {recipe.perfectPairings && (
        <div className="mb-8 sm:mb-10 lg:mb-[50px]">
          <div className="bg-white rounded-[15px] border border-[#CECECE] w-full px-4 sm:px-6 lg:px-[20px] py-4 sm:py-6 lg:py-[20px]">
            <h2 className="text-xl sm:text-2xl lg:text-[25px] font-bold text-black mb-4 sm:mb-6 lg:mb-[20px] font-raleway">Perfect pairings:</h2>
            <p className="text-base sm:text-lg lg:text-[18px] font-raleway text-black">
              {recipe.perfectPairings}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecipeDetails