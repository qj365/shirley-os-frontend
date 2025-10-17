import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
function About({ img }: { img: string }) {
  const data = [
    { value: '14k+', label: 'Active customer' },
    { value: '300+', label: 'Active Wholeseller' },
    { value: '50+', label: 'Active Restaurant' },
  ];

  return (
    <>
      <section className="container flex w-full flex-col items-center justify-center gap-12 py-[76px] md:py-[100px] lg:flex-row">
        <figure className="m-0 h-[400px] w-fit md:h-[500px]">
          <Image
            src={img}
            alt="about us"
            width="0"
            height="0"
            sizes="100vw"
            className="h-full w-full object-contain"
          />
        </figure>

        <div className="w-full space-y-8 lg:w-1/2">
          <div className="flex gap-4">
            <div className="w-2 rounded bg-[#F3C03F]"></div>
            <h2 className="text-3xl font-bold md:text-4xl">
              From Family Table to Your Kitchen
            </h2>
          </div>

          <p className="text-lg text-gray-700 md:text-xl">
            Shirley&apos;s transforms the vibrant culinary traditions of West
            Africa into premium products that honour authenticity. Our flagship
            Jollof paste captures generations of culinary expertise in a single
            jar, reducing a complex two-hour process to just minutes.
          </p>

          <div className="flex flex-wrap gap-6">
            {data.map((item, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-4xl font-medium">{item.value}</h3>
                <p className="text-lg">{item.label}</p>
              </div>
            ))}
          </div>
          <Link
            href="/shop"
            className="flex w-fit items-center gap-2 rounded-full border-2 border-[#FFD56A] bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] px-8 py-4 text-xl font-medium shadow-inner"
          >
            Shop Now
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </section>
    </>
  );
}

export default About;
