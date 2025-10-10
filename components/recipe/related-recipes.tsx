"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react';
import { recipes } from '@/constants/recipe-data/recipes'

interface Recipe {
  id: number
  title: string
  image: string
  tags: string[]
  cookTime: string
  servings: string
  href: string
}

interface RelatedRecipesProps {
  currentRecipeSlug?: string
}

const RelatedRecipes = ({ currentRecipeSlug }: RelatedRecipesProps) => {
  // Filter out the current recipe and map to the expected format
  const relatedRecipes: Recipe[] = recipes
    .filter(recipe => recipe.slug !== currentRecipeSlug)
    .map(recipe => ({
      id: parseInt(recipe.id),
      title: recipe.title,
      image: recipe.heroImage,
      tags: ["Appetizers", "Rice", "Healthy Eats"],
      cookTime: recipe.metaInfo.cookTime,
      servings: recipe.metaInfo.serves,
      href: `/recipe/${recipe.slug}`
    }))
    .slice(0, 3); // Show only 3 related recipes

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="text-center mb-8 sm:mb-10 lg:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4" style={{ fontFamily: 'Raleway' }}>
          You Might Also Like
        </h2>
        {/* <p className="text-lg text-gray-600" style={{ fontFamily: 'Raleway' }}>
          Discover more delicious West African recipes
        </p> */}
      </div>

      {/* Centered grid container */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {relatedRecipes.map((recipe) => (
            <Link key={recipe.id} href={recipe.href} className="group">
              <div className="bg-gray-100 rounded-2xl overflow-hidden transition-all duration-300" style={{ backgroundColor: 'rgb(238, 238, 238)' }}>
                {/* Recipe Image */}
                <div className="relative w-full h-48 sm:h-64 lg:h-80 overflow-hidden">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform duration-300"
                  />
                </div>
                
                {/* Tags */}
                <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                    {recipe.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-black font-semibold text-xs sm:text-sm"
                        style={{ fontFamily: 'Raleway' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Recipe Title */}
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-3 sm:mb-4 transition-colors" style={{ fontFamily: 'Raleway' }}>
                    {recipe.title}
                  </h3>
                  
                  {/* See Full Recipe Button */}
                  <button className="w-full bg-[#FFC020] text-black font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-[33px] hover:bg-[#FFB000] transition-colors flex items-center justify-between text-sm sm:text-base" style={{ fontFamily: 'Raleway' }}>
                    <span>See the full recipe</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RelatedRecipes