'use client';

import React from 'react';
import { Recipe } from '@/constants/recipe-data/recipes';

interface RecipeDetailsProps {
  recipe: Recipe;
}

const RecipeDetails = ({ recipe }: RecipeDetailsProps) => {
  return (
    <div className="container py-8 sm:py-12 lg:py-16">
      {/* Ingredients Section */}
      <div className="mb-8 sm:mb-10 lg:mb-[50px]">
        <div className="w-full rounded-[15px] border border-[#CECECE] bg-white px-4 py-4 sm:px-6 sm:py-6 lg:px-[20px] lg:py-[20px]">
          <h2 className="font-raleway mb-4 text-xl font-bold text-black sm:mb-6 sm:text-2xl lg:mb-[20px] lg:text-[25px]">
            What you&apos;ll need:
          </h2>
          <div className="space-y-3 sm:space-y-4 lg:space-y-[20px]">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index}>
                <span className="font-raleway text-base sm:text-lg lg:text-[20px]">
                  • {ingredient}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="mb-8 sm:mb-10 lg:mb-[50px]">
        <h2 className="font-raleway mb-6 text-xl font-bold text-black sm:mb-8 sm:text-2xl lg:mb-[30px] lg:text-[25px]">
          Let&apos;s cook together:
        </h2>
        <div className="space-y-4 sm:space-y-6 lg:space-y-[25px]">
          {recipe.instructions.map((instruction, index) => (
            <div key={index}>
              <div className="flex flex-col items-start rounded-[20px] bg-[#F7F7F7] p-4 sm:flex-row sm:p-6 lg:p-[20px]">
                <div
                  className="font-raleway mb-3 self-start text-3xl font-bold sm:mr-4 sm:mb-0 sm:text-4xl lg:mr-5 lg:text-[60px]"
                  style={{
                    background:
                      'linear-gradient(157deg, #F3C03F 11.78%, #FFBA0A 88.22%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <h3 className="font-raleway mb-2 text-lg font-bold text-black sm:mb-3 sm:text-xl lg:mb-[10px] lg:text-[20px]">
                    {instruction.title}
                  </h3>
                  <p className="font-raleway text-base text-black sm:text-lg lg:text-[18px]">
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
          <div className="w-full rounded-[15px] border border-[#CECECE] bg-white px-4 py-4 sm:px-6 sm:py-6 lg:px-[20px] lg:py-[20px]">
            <h2 className="font-raleway mb-4 text-xl font-bold text-black sm:mb-6 sm:text-2xl lg:mb-[20px] lg:text-[25px]">
              Chef&apos;s Tips:
            </h2>
            <div className="space-y-3 sm:space-y-4 lg:space-y-[15px]">
              {recipe.chefTips.map((tip, index) => (
                <div key={index}>
                  <span className="font-raleway text-base text-black sm:text-lg lg:text-[18px]">
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
          <div className="w-full rounded-[15px] border border-[#CECECE] bg-white px-4 py-4 sm:px-6 sm:py-6 lg:px-[20px] lg:py-[20px]">
            <h2 className="font-raleway mb-4 text-xl font-bold text-black sm:mb-6 sm:text-2xl lg:mb-[20px] lg:text-[25px]">
              Perfect pairings:
            </h2>
            <p className="font-raleway text-base text-black sm:text-lg lg:text-[18px]">
              {recipe.perfectPairings}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
