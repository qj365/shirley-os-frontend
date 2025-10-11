import { premiumData, PremiumType } from "@/constants/landing/premium";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Premium() {
  // Function to generate the appropriate URL for each premium product
  const getPremiumUrl = (item: PremiumType) => {
    // Map the premium product titles to appropriate category parameters
    if (item.title === "Shirley's Jollof Paste") {
      return "/shop?category=Jollof%20Paste";
    } else if (item.title === "Shirley's Red Sauce") {
      return "/shop?category=Red%20Sauce";
    }
    // Default fallback
    return `/shop?category=${encodeURIComponent(item.title)}`;
  };

  return (
    <section className="w-full lg:w-[60%] mx-auto px-6 py-12 mb-28 md:py-24">
      <div className="text-center mb-16 md:mb-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Premium Products, Authentic <br /> Flavours
        </h2>
        <p className="text-lg md:text-xl text-gray-800 max-w-4xl mx-auto">
          Our carefully crafted range maintains the depth and complexity of
          traditional West African cuisine while offering unparalleled
          convenience.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {premiumData.map((item: PremiumType, index: number) => {
            return (
              <Link href={getPremiumUrl(item)} key={index}>
                <div className="relative flex flex-col justify-center items-center cursor-pointer">
                  {/* Circular image container with responsive sizing */}
                  <div className="absolute top-0 w-full flex justify-center">
                    <div className="w-3/4 md:w-2/3 lg:w-3/4 aspect-square rounded-full border-[10px] border-[#FFC020] overflow-hidden flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={500}
                        height={500}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>
                  
                  {/* Card with responsive padding and sizing */}
                  <div className="w-full pt-[calc(37.5%+2rem)] pb-6 px-4 md:px-6 rounded-xl flex flex-col justify-end text-center items-center border-2 bg-white border-gray-100 mt-[37.5%]">
                    <h3 className="text-xl md:text-2xl font-bold">{item.title}</h3>
                    <p className="text-base md:text-lg text-gray-700 mt-4">{item.para}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Premium;
