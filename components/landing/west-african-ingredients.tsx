"use client";

import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ingredients } from "@/constants/landing/ingrediant";
import { useState } from "react";

export default function WestAfricanIngredients() {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="w-full px-5 md:px-16 py-10 md:py-12 ">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 ">
        {/* Left side - Heading and description */}
        <div className="w-full lg:w-2/5 flex flex-col gap-8 lg:gap-12 lg:sticky lg:top-24 self-start">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold italic font-raleway leading-tight">
            Crafted with the finest ingredients sourced from the heart of West
            Africa,
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-[#373737] font-raleway">
            We carefully select traditional ingredients that deliver authentic
            flavour while ensuring convenient preparation for modern kitchens.
          </p>
        </div>

        {/* Right side - Ingredients list */}
        <div className="w-full lg:w-3/5 flex flex-col gap-4 md:gap-6">
          {ingredients.map((ingredient, index) => {
            const isExpanded = expandedItems.includes(index);
            return (
              <div key={index} className="flex flex-col">
                {/* Ingredient header - always visible */}
                <div
                  className={`group flex items-center gap-4 md:gap-6 p-3 md:p-4 rounded-lg transition-colors duration-200 cursor-pointer ${
                    isExpanded ? 'bg-[#ffedc3]' : 'hover:bg-[#ffedc3]'
                  }`}
                  onClick={() => toggleExpanded(index)}
                >
                  {/* Ingredient icon */}
                  <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border border-[#EFEFEF] transition-colors duration-200 ${
                    isExpanded ? 'bg-white' : 'bg-[#ffedc3] group-hover:bg-white'
                  }`}>
                    <div className="relative w-10 h-10 md:w-12 md:h-12">
                      <Image
                        src={ingredient.image}
                        alt={ingredient.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Ingredient name */}
                  <h3 className="flex-1 text-lg md:text-xl font-bold font-raleway">
                    {ingredient.name}
                  </h3>

                  {/* Chevron icon */}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200" />
                  )}
                </div>

                {/* Ingredient description - collapsible */}
                {isExpanded && (
                  <div className="px-3 md:px-4 pb-3 md:pb-4">
                    <p className="text-sm md:text-base font-raleway mt-5 ml-20 md:ml-26 transition-all duration-200 ease-in-out">
                      {ingredient.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[653px] 
                    overflow-hidden 
                    mt-8 sm:mt-12 md:mt-16 lg:mt-[99px] 
                    rounded-lg sm:rounded-xl md:rounded-2xl 
                    relative"
      >
        <Image
          src="/image/landingPageImages/image.png"
          alt="Hero image"
          fill
          sizes="(max-width: 640px) 100vw, 
               (max-width: 768px) 100vw, 
               (max-width: 1024px) 100vw, 
               100vw"
          priority
          className="object-cover"
        />
      </div>
    </section>
  );
}
