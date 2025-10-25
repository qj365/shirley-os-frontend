import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { westAfricanData, WSData } from '@/constants/landing/west-african';
import Link from 'next/link';

export default function WestAfricanSection() {
  return (
    <section className="w-full px-6 md:px-0">
      <div className="flex flex-col lg:flex-row">
        {/* Left side - Image */}
        <div className="relative h-[400px] w-full bg-green-300 md:h-[900px] lg:w-1/2">
          <Image
            src="/image/landingPageImages/premium4.png"
            alt="West African cuisine"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right side - Content */}
        <div className="flex w-full flex-col px-0 py-10 md:px-[42px] lg:w-1/2">
          {/* Main content */}
          <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
            <h2 className="text-2xl leading-tight font-bold md:text-3xl lg:text-4xl">
              Bringing authentic West African flavour to kitchens worldwide
            </h2>
            <p className="text-lg text-[#373737] md:text-xl lg:text-2xl">
              Transforming traditional recipes into convenient, premium products
              enjoyed in homes across the UK and beyond
            </p>
            <Link href="/shop">
              <button className="mt-4 flex w-fit items-center justify-center gap-2 rounded-full border-2 border-[#FFD56A] bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] px-6 py-3 shadow-inner shadow-black/25 hover:cursor-pointer active:scale-95">
                <span className="text-lg font-medium md:text-xl lg:text-2xl">
                  Shop now
                </span>
                <ArrowRight className="h-6 w-6 rotate-90" />
              </button>
            </Link>
          </div>

          {/* Features grid */}
          <div className="mt-12 grid grid-cols-2 gap-6 md:mt-16 md:grid-cols-3 lg:mt-20">
            {/* Feature 1 */}

            {westAfricanData.map((item: WSData, index: number) => {
              return (
                <div key={index} className="flex flex-col items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full">
                    <Image
                      src={item.image}
                      alt="item.name"
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="font-raleway w-35 text-center text-base font-semibold md:text-lg lg:text-xl">
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
