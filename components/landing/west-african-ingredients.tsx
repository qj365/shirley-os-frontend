'use client';

import { ingredients } from '@/constants/landing/ingrediant';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function WestAfricanIngredients() {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleDownloadPDF = () => {
    const pdfUrl =
      'https://pub-1e0e5da8ae504195b9ff374220e9ef05.r2.dev/Jollof%20Paste%20Cooking%20Instructions.pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Jollof Paste Cooking Instructions.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="w-full px-5 py-10 md:px-16 md:py-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        {/* Left side - Heading and description */}
        <div className="flex w-full flex-col gap-8 self-start lg:sticky lg:top-24 lg:w-2/5 lg:gap-12">
          <h2 className="font-raleway text-2xl leading-tight font-semibold italic md:text-4xl lg:text-5xl">
            Crafted with the finest ingredients sourced from the heart of West
            Africa
          </h2>
          <p className="font-raleway text-lg text-[#373737] md:text-xl lg:text-2xl">
            We carefully select traditional ingredients that deliver authentic
            flavour while ensuring convenient preparation for modern kitchens.
          </p>

          <button
            onClick={handleDownloadPDF}
            className="flex w-fit items-center justify-center gap-2 rounded-full border-2 border-[#FFD56A] bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] px-6 py-3 font-semibold text-black shadow-inner shadow-black/25 active:scale-95"
          >
            How To Use
          </button>
        </div>

        {/* Right side - Ingredients list */}
        <div className="flex w-full flex-col gap-4 md:gap-6 lg:w-3/5">
          {ingredients.map((ingredient, index) => {
            const isExpanded = expandedItems.includes(index);
            return (
              <div key={index} className="flex flex-col">
                {/* Ingredient header - always visible */}
                <div
                  className={`group flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-colors duration-200 md:gap-6 md:p-4 ${
                    isExpanded ? 'bg-[#ffedc3]' : 'hover:bg-[#ffedc3]'
                  }`}
                  onClick={() => toggleExpanded(index)}
                >
                  {/* Ingredient icon */}
                  <div
                    className={`relative flex h-16 w-16 items-center justify-center rounded-full border border-[#EFEFEF] transition-colors duration-200 md:h-20 md:w-20 ${
                      isExpanded
                        ? 'bg-white'
                        : 'bg-[#ffedc3] group-hover:bg-white'
                    }`}
                  >
                    <div className="relative h-10 w-10 md:h-12 md:w-12">
                      <Image
                        src={ingredient.image}
                        alt={ingredient.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Ingredient name */}
                  <h3 className="font-raleway flex-1 text-lg font-bold md:text-xl">
                    {ingredient.name}
                  </h3>

                  {/* Chevron icon */}
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 transition-transform duration-200 md:h-6 md:w-6" />
                  ) : (
                    <ChevronDown className="h-5 w-5 transition-transform duration-200 md:h-6 md:w-6" />
                  )}
                </div>

                {/* Ingredient description - collapsible */}
                {isExpanded && (
                  <div className="px-3 pb-3 md:px-4 md:pb-4">
                    <p className="font-raleway mt-5 ml-20 text-sm transition-all duration-200 ease-in-out md:ml-26 md:text-base">
                      {ingredient.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative mt-8 h-[300px] w-full overflow-hidden rounded-lg sm:mt-12 sm:h-[400px] sm:rounded-xl md:mt-16 md:h-[500px] md:rounded-2xl lg:mt-[99px] lg:h-[653px]">
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
