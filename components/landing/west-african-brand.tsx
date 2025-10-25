'use client';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function WestAfricanBrand() {
  const [, setIsMobile] = useState(false);

  // Hook to detect screen width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // 768px or below for mobile
    };

    // Initial check
    handleResize();

    // Add event listener to resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="w-full py-16 md:py-24">
      <div className="flex flex-col-reverse gap-20 md:flex-col">
        {/* First Section - Community Impact */}
        <div className="flex w-[100%] flex-col-reverse items-center justify-between gap-20 lg:flex-row">
          {/* Left side - Image */}
          <div className="w-full">
            <div className="relative aspect-[0.85/1] w-full overflow-hidden rounded-[18px] border border-[#E3E3E3]">
              <Image
                src="/image/landingPageImages/african1.png"
                alt="SS Life Skills community impact"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="w-full">
            <div className="flex flex-col gap-14">
              <div className="flex flex-col gap-8">
                <div className="flex gap-5">
                  <div className="h-auto min-h-[50px] w-[7px] rounded-[7px] bg-[#F3C03F]" />
                  <h2 className="font-raleway text-xl leading-tight font-bold md:text-2xl lg:text-3xl">
                    Our Community Impact:
                    <br /> SS Life Skills
                  </h2>
                </div>
                <p className="font-raleway text-base text-[#373737] md:text-lg lg:text-2xl">
                  SS Life Skills, our charitable initiative, provides
                  educational and vocational training to those facing barriers
                  to employment and social inclusion. Established in 2014 as a
                  Community Interest Company, we&apos;re committed to creating
                  lasting social impact alongside our premium food products.
                </p>
              </div>
              <Link href="https://www.sslifeskills.co.uk/" target="_blank">
                <button className="flex w-fit items-center justify-center gap-2 rounded-full border-2 border-[#FFD56A] bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] px-6 py-3 shadow-inner shadow-black/25 active:scale-95">
                  <span className="font-raleway text-lg font-medium md:text-xl lg:text-2xl">
                    Our Mission
                  </span>
                  <ArrowRight className="h-6 w-6" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Second Section - West African Cuisine */}
        <div className="flex flex-col-reverse items-center justify-between gap-8 lg:flex-row">
          {/* Left side - Content */}
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col gap-12">
              <div className="flex gap-5">
                <div className="h-auto min-h-[60px] w-[9px] rounded-[7px] bg-[#F3C03F]" />
                <h2 className="font-raleway text-2xl leading-tight font-bold md:text-3xl lg:text-4xl">
                  West African Cuisine, <br /> Reimagined
                </h2>
              </div>

              <p className="font-raleway text-lg text-[#373737] md:text-xl lg:text-2xl">
                Born from necessity when a single mother of five needed to feed
                her family quality cultural food while managing limited time,
                Shirley&apos;s has evolved into a premium food brand that brings
                West African cuisine to kitchens across the UK.
              </p>
              <Link href="/shop">
                <button className="flex w-fit items-center justify-center gap-2 rounded-full border-2 border-[#FFD56A] bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] px-6 py-3 shadow-inner shadow-black/25 active:scale-95">
                  <span className="font-raleway text-lg font-medium md:text-xl lg:text-2xl">
                    Shop Now
                  </span>
                  <ArrowRight className="h-6 w-6" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right side - Image with dot pattern */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              {/* Dot pattern */}
              {/* <div className="absolute left-0 top-1/4 flex gap-4 z-10">
                {[0, 1].map((col) => (
                  <div key={col} className="flex flex-col gap-3">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                      <div
                        key={row}
                        className="w-[15px] h-[15px] rounded-full bg-black"
                      />
                    ))}
                  </div>
                ))}
              </div> */}

              {/* Yellow background */}
              {/* <div className="absolute right-0 top-8 w-[90%] h-[90%] bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] rounded-[40px]" /> */}

              {/* Main image */}
              <div className="relative ml-auto aspect-[0.85/1] w-[100%] overflow-hidden rounded-[18px]">
                <Image
                  src="/image/landingPageImages/westafrica.jpeg"
                  alt="West African cuisine"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
