'use client';

import React from 'react';
import Image from 'next/image';
import { Recipe } from '@/constants/recipe-data/recipes';
import { cn } from '@/lib/utils';

interface RecipeHeroProps {
  recipe: Recipe;
}

const RecipeHero = ({ recipe }: RecipeHeroProps) => {
  return (
    <>
      {/* Hero Banner Section */}
      <div className="container pt-16 sm:pt-20 lg:pt-24">
        {/* Rounded Rectangle Background */}
        <div className="relative mt-8 h-[250px] w-full overflow-hidden rounded-[15px] sm:mt-12 sm:h-[350px] lg:mt-15 lg:h-[450px]">
          {/* Recipe Image */}
          <Image
            src={recipe.heroImage}
            alt={recipe.title}
            fill
            className={cn('object-cover', recipe?.customHeroImageClass)}
            priority
            quality={100}
          />
        </div>

        {/* Recipe Title and Meta Info */}
        <div className="mt-6 sm:mt-8 lg:mt-[50px]">
          {/* Recipe Title */}
          <h1 className="font-raleway mb-8 text-2xl leading-tight font-bold text-black sm:mb-12 sm:text-3xl sm:leading-[45px] lg:mb-[64px] lg:text-[40px] lg:leading-[60px]">
            {recipe.title}
          </h1>

          {/* Recipe Meta Information */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:flex lg:items-start lg:justify-between lg:gap-[100px]">
            {/* Serving Info */}
            <div className="flex items-center gap-[8px] sm:gap-[12px]">
              <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#FFEDC3] sm:h-[40px] sm:w-[40px]">
                <svg
                  width="16"
                  height="16"
                  className="sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10 3.33C8.16 3.33 6.67 4.82 6.67 6.67C6.67 8.51 8.16 10 10 10C11.84 10 13.33 8.51 13.33 6.67C13.33 4.82 11.84 3.33 10 3.33ZM10 13.33C6.67 13.33 3.33 15 3.33 16.67V18.33H16.67V16.67C16.67 15 13.33 13.33 10 13.33Z"
                    fill="#FFC020"
                  />
                </svg>
              </div>
              <div>
                <p className="font-raleway text-sm font-semibold text-[#7C7C7C] sm:text-base lg:text-[18px]">
                  Serving
                </p>
                <p className="font-raleway text-base font-bold text-black sm:text-lg lg:text-[20px]">
                  {recipe.metaInfo.serves}
                </p>
              </div>
            </div>

            {/* Cook Time */}
            <div className="flex items-center gap-[8px] sm:gap-[12px]">
              <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#FFEDC3] sm:h-[40px] sm:w-[40px]">
                <svg
                  width="16"
                  height="16"
                  className="sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10 1.67C5.4 1.67 1.67 5.4 1.67 10S5.4 18.33 10 18.33 18.33 14.6 18.33 10 14.6 1.67 10 1.67ZM10 16.67C6.32 16.67 3.33 13.68 3.33 10S6.32 3.33 10 3.33 16.67 6.32 16.67 10 13.68 16.67 10 16.67ZM10.83 5H9.17V10.42L14.17 13.2L15 11.8L10.83 9.58V5Z"
                    fill="#FFC020"
                  />
                </svg>
              </div>
              <div>
                <p className="font-raleway text-sm font-semibold text-[#7C7C7C] sm:text-base lg:text-[18px]">
                  Cook Time
                </p>
                <p className="font-raleway text-base font-bold text-black sm:text-lg lg:text-[20px]">
                  {recipe.metaInfo.cookTime}
                </p>
              </div>
            </div>

            {/* Cuisine */}
            <div className="flex items-center gap-[8px] sm:gap-[12px]">
              <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#FFEDC3] sm:h-[40px] sm:w-[40px]">
                <svg
                  width="16"
                  height="16"
                  className="sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10 1.67L12.5 7.5L18.33 8.33L14.17 12.5L15 18.33L10 15.83L5 18.33L5.83 12.5L1.67 8.33L7.5 7.5L10 1.67Z"
                    fill="#FFC020"
                  />
                </svg>
              </div>
              <div>
                <p className="font-raleway text-sm font-semibold text-[#7C7C7C] sm:text-base lg:text-[18px]">
                  Cuisine
                </p>
                <p className="font-raleway text-base font-bold text-black sm:text-lg lg:text-[20px]">
                  {recipe.metaInfo.cuisine}
                </p>
              </div>
            </div>

            {/* Difficulty */}
            <div className="flex items-center gap-[8px] sm:gap-[12px]">
              <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#FFEDC3] sm:h-[40px] sm:w-[40px]">
                <svg
                  width="16"
                  height="16"
                  className="sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10 1.67L12.5 7.5L18.33 8.33L14.17 12.5L15 18.33L10 15.83L5 18.33L5.83 12.5L1.67 8.33L7.5 7.5L10 1.67Z"
                    fill="#FFC020"
                  />
                </svg>
              </div>
              <div>
                <p className="font-raleway text-sm font-semibold text-[#7C7C7C] sm:text-base lg:text-[18px]">
                  Difficulty
                </p>
                <p className="font-raleway text-base font-bold text-black sm:text-lg lg:text-[20px]">
                  {recipe.metaInfo.difficulty}
                </p>
              </div>
            </div>

            {/* Prep Time */}
            <div className="flex items-center gap-[8px] sm:gap-[12px]">
              <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#FFEDC3] sm:h-[40px] sm:w-[40px]">
                <svg
                  width="16"
                  height="16"
                  className="sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10 1.67C5.4 1.67 1.67 5.4 1.67 10S5.4 18.33 10 18.33 18.33 14.6 18.33 10 14.6 1.67 10 1.67ZM10 16.67C6.32 16.67 3.33 13.68 3.33 10S6.32 3.33 10 3.33 16.67 6.32 16.67 10 13.68 16.67 10 16.67ZM10.83 5H9.17V10.42L14.17 13.2L15 11.8L10.83 9.58V5Z"
                    fill="#FFC020"
                  />
                </svg>
              </div>
              <div>
                <p className="font-raleway text-sm font-semibold text-[#7C7C7C] sm:text-base lg:text-[18px]">
                  Prep Time
                </p>
                <p className="font-raleway text-base font-bold text-black sm:text-lg lg:text-[20px]">
                  {recipe.metaInfo.prep}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeHero;
