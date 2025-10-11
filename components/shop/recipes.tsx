import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { recipes } from '@/constants/recipe-data/recipes';

export default function Recipes() {
  // Use the first 3 recipes from the recipe data
  const recipeData = recipes.slice(0, 3);

  return (
    <section className="w-full relative">
      {/* Background with cream color from Zeplin design */}
      <div 
        className="w-full py-16 px-6"
        style={{
          backgroundColor: 'rgb(255, 251, 242)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold mb-6">
              Our Recipes
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-black/85 max-w-5xl mx-auto leading-relaxed mb-8">
              From traditional classics to modern interpretations, each<br />
              dish celebrates the rich culinary heritage of West Africa whilst offering<br />
              simplicity and convenience
            </p>
          </div>

          {/* Recipe Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-10">
            {recipeData.map((recipe) => (
              <Link 
                key={recipe.id}
                href={`/recipe/${recipe.slug}`}
                className="block group"
              >
                <div className="bg-[#EEEEEE] rounded-2xl overflow-hidden shadow-lg">
                  {/* Recipe Image */}
                  <div className="relative h-80 bg-gray-100">
                    <Image
                      src={recipe.heroImage}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Tags */}
                  <div className="px-6 pt-6 pb-3">
                    {/* <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-white px-4 py-2 rounded-full text-black font-semibold text-sm">
                        Appetizers
                      </span>
                      <span className="bg-white px-4 py-2 rounded-full text-black font-semibold text-sm">
                        Rice
                      </span>
                      <span className="bg-white px-4 py-2 rounded-full text-black font-semibold text-sm">
                        Healthy Eats
                      </span>
                    </div> */}
                    
                    {/* Recipe Title */}
                    <h3 className="text-xl md:text-2xl lg:text-lg font-medium text-black leading-tight font-raleway mb-4">
                      {recipe.title}
                    </h3>
                    
                    {/* See Full Recipe Button */}
                    <button className="w-full bg-[#FFC020] text-black font-bold py-3 px-6 rounded-[33px] hover:bg-[#FFB000] transition-colors flex items-center justify-between text-base font-raleway">
                      <span>See the full recipe</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
