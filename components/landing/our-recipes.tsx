import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function OurRecipes() {
  const recipes = [
    {
      id: 1,
      title: "Shirley's Classic Jollof Rice",
      image: "/image/landingPageImages/recipe1.png",
      slug: "shirleys-classic-jollof-rice"
    },
    {
      id: 2,
      title: "Signature Sautéed Onions",
      image: "/image/landingPageImages/recipe2.png",
      slug: "signature-sauteed-onions"
    },
    {
      id: 3,
      title: "Hearty Mushroom Spinach Stew",
      image: "/image/landingPageImages/recipe3.jpg",
      slug: "hearty-mushroom-spinach-stew"
    }
  ];

  return (
    <section className="w-full relative lg:mt-10">
      {/* Gradient Background */}
      <div 
        className="w-full py-16"
        style={{
          background: 'linear-gradient(180deg, rgb(243, 192, 63) 0%, rgb(255, 186, 10) 100%)',
          boxShadow: 'inset 0 9px 10px 0 rgb(210, 151, 2), inset 0 -9px 15px 0 rgba(210, 151, 2, 0.25)'
        }}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-black mb-6">
              Our Recipes
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-black/85 max-w-5xl mx-auto leading-relaxed mb-8">
              From traditional classics to modern interpretations, each<br />
              dish celebrates the rich culinary heritage of West Africa whilst offering<br />
              simplicity and convenience
            </p>
          </div>

          {/* Recipe Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {recipes.map((recipe) => (
              <Link 
                key={recipe.id}
                href={`/recipe/${recipe.slug}`}
                className="block group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                  {/* Recipe Image */}
                  <div className="relative h-80 bg-gray-100">
                    <Image
                      src={recipe.image}
                      alt={recipe.title.replace('\n', ' ')}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Recipe Title */}
                  <div className="p-6">
                    <h3 className="text-base md:text-xl lg:text-lg font-medium text-black leading-tight">
                      {recipe.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          {/* <div className="text-center">
            <Link 
              href="/recipes"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-normal text-lg rounded-full hover:bg-gray-800 transition-colors duration-300 font-raleway"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div> */}
        </div>
      </div>
    </section>
  );
}