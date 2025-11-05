'use client';
import { premiumData, PremiumType } from '@/constants/landing/premium';
import Image from 'next/image';
import Link from 'next/link';

function Premium() {
  // Function to generate the appropriate URL for each premium product
  const getPremiumUrl = (item: PremiumType) => {
    // Map the premium product titles to appropriate category parameters
    if (item.title === "Shirley's Jollof Paste") {
      return '/shop?category=Jollof%20Paste';
    } else if (item.title === "Shirley's Red Sauce") {
      return '/shop?category=Red%20Sauce';
    }
    // Default fallback
    return `/shop?category=${encodeURIComponent(item.title)}`;
  };

  const handleDownloadPDF = () => {
    const pdfUrl =
      'https://cdn.shirleysfoods.com/Jollof%20Paste%20Cooking%20Instructions.pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Jollof Paste Cooking Instructions.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="mx-auto mb-10 w-full px-6 py-12 md:mb-20 md:py-24 lg:w-[60%]">
      <div className="mb-16 text-center md:mb-24">
        <h2 className="mb-6 text-3xl font-bold md:text-4xl">
          Premium Products, Authentic <br /> Flavours
        </h2>
        <p className="mx-auto max-w-4xl text-lg text-gray-800 md:text-xl">
          Our carefully crafted range maintains the depth and complexity of
          traditional West African cuisine while offering unparalleled
          convenience.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {premiumData.map((item: PremiumType, index: number) => {
            return (
              <Link href={getPremiumUrl(item)} key={index}>
                <div className="relative flex h-full cursor-pointer flex-col items-center justify-center">
                  {/* Circular image container with responsive sizing */}
                  <div className="absolute top-0 flex w-full justify-center">
                    <div className="flex aspect-square w-3/4 items-center justify-center overflow-hidden rounded-full border-[10px] border-[#FFC020] md:w-2/3 lg:w-3/4">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={500}
                        height={500}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  </div>

                  {/* Card with responsive padding and sizing */}
                  <div className="mt-[37.5%] flex w-full flex-1 flex-col items-center justify-between rounded-xl border-2 border-gray-100 bg-white px-4 pt-[calc(37.5%+2rem)] pb-6 text-center md:px-6">
                    <h3 className="text-xl font-bold md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-base text-gray-700 md:text-lg">
                      {item.para}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-16 cursor-pointer" onClick={handleDownloadPDF}>
        <div className="relative h-38 w-full overflow-hidden rounded-lg sm:h-70">
          <Image
            src="/image/landingPageImages/how_to_use.jpg"
            alt="Shirley's Jollof Paste"
            width={0}
            height={0}
            sizes="100vw"
            className="h-full w-full object-cover"
          />
          <span className="absolute top-[20px] left-1/2 -translate-x-1/2 text-base font-bold sm:text-2xl">
            HOW TO USE
          </span>
        </div>
        <p className="mt-1 text-center text-base md:text-lg">
          <i>
            To make perfect Jollof rice using Shirley&apos;s Jollof Paste, click
            here to download instructions
          </i>
        </p>
      </div>
    </section>
  );
}

export default Premium;
