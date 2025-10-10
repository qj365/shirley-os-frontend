import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { westAfricanData, WSData } from "@/constants/landing/west-african";
import Link from "next/link";

export default function WestAfricanSection() {
  return (
    <section className="w-full px-6 md:px-0  ">
      <div className="flex flex-col lg:flex-row">
        {/* Left side - Image */}
        <div className="w-full lg:w-1/2 bg-green-300 h-[400px] md:h-[900px]  relative">
          <Image
            src="/image/landingPageImages/premium4.png"
            alt="West African cuisine"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right side - Content */}
        <div className="w-full lg:w-1/2 px-0 md:px-[42px] py-10 flex flex-col">
          {/* Main content */}
          <div className="flex flex-col  gap-6 md:gap-8 lg:gap-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              Bringing authentic West African flavour to kitchens worldwide
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-[#373737] ">
              Transforming traditional recipes into convenient, premium products
              enjoyed in homes across the UK and beyond
            </p>
            <Link href="/shop">
              <button className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] 
              border-2 border-[#FFD56A] rounded-full py-3 px-6 w-fit shadow-inner active:scale-95 shadow-black/25 mt-4 hover:cursor-pointer">
                <span className="text-lg md:text-xl lg:text-2xl font-medium ">
                  Shop now
                </span>
                <ArrowRight className="w-6 h-6 rotate-90" />
              </button>
            </Link>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12 md:mt-16 lg:mt-20">
            {/* Feature 1 */}

            {westAfricanData.map((item: WSData, index: number) => {
              return (
                <div key={index} className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14  rounded-full flex items-center justify-center">
                    <Image
                      src={item.image}
                      alt="item.name"
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-center text-base md:text-lg lg:text-xl font-semibold font-raleway w-35">
                    {item.text}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
