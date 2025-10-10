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
      <section className="mx-auto flex w-full max-w-screen-2xl flex-col items-center justify-center gap-4 px-4 py-[76px] md:gap-12 md:py-[100px] lg:flex-row">
        {/* left div - Image */}

        <div className="flex h-1/2 w-full flex-col items-center justify-center md:h-full md:w-3/4 md:flex-row lg:w-[45%] xl:w-[50%]">
          <div className="relative flex h-[350px] w-full items-center justify-center rounded-full border-t-4 border-dashed border-amber-300 md:h-[570px] xl:h-[600px] 2xl:h-[650px]">
            <div className="items- flex h-[508px] w-[513px] justify-center rounded-full xl:h-[550px] xl:w-[550px] 2xl:h-[600px] 2xl:w-[600px]">
              <Image
                src={img}
                alt="image"
                width={513}
                height={508}
                className="absolute top-[40px] left-[20px] h-[250px] w-[250px] md:top-10 md:left-8 md:h-[508px] md:w-[513px] lg:left-10 xl:left-12 xl:h-[550px] xl:w-[550px] 2xl:left-16 2xl:h-[600px] 2xl:w-[600px]"
              />
            </div>
            <div>
              <Image
                src="/image/landingPageImages/rice.png"
                alt="About Shirley's"
                width={100}
                height={100}
                className="absolute top-8 left-0 z-50 h-[50px] w-[50px] md:top-[20px] md:left-[40px] md:h-[100px] md:w-[100px]"
              />
              <Image
                src="/image/landingPageImages/biryani.png"
                alt="About Shirley's"
                width={100}
                height={100}
                className="absolute top-[25px] right-[25px] z-50 h-[50px] w-[50px] md:h-[100px] md:w-[100px]"
              />
              <Image
                src="/image/landingPageImages/rice1.png"
                alt="About Shirley's"
                width={136}
                height={135}
                className="absolute top-[-40px] left-[110px] h-20 w-20 md:top-[-100px] md:left-[250px] md:h-[135px] md:w-[135px]"
              />
              <Image
                src="/image/landingPageImages/leaf1.png"
                alt="About Shirley's"
                width={60}
                height={58}
                className="absolute top-2 left-4 h-10 w-10 md:top-0 md:left-[86px] md:h-[58px] md:w-[60px]"
              />
              <Image
                src="/image/landingPageImages/lemon1.png"
                alt="About Shirley's"
                width={60}
                height={58}
                className="absolute top-[20px] right-[35px] h-10 w-10 md:top-[20px] md:right-[105px] md:h-[58px] md:w-[60px]"
              />
            </div>
          </div>
        </div>

        {/* right div - text */}
        <div className="w-full space-y-8 md:w-1/2">
          <div className="flex gap-4">
            <div className="w-2 rounded bg-[#F3C03F]"></div>
            <h2 className="text-3xl font-bold md:text-4xl">From Family Table to Your Kitchen</h2>
          </div>

          <p className="text-lg text-gray-700 md:text-xl">
            Shirley&apos;s transforms the vibrant culinary traditions of West Africa into premium
            products that honour authenticity. Our flagship Jollof paste captures generations of
            culinary expertise in a single jar, reducing a complex two-hour process to just minutes.
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
