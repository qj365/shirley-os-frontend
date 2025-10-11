import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
function About({ img }: { img: string }) {
  const data = [
    { value: "14k+", label: "Active customer" },
    { value: "300+", label: "Active Wholeseller" },
    { value: "50+", label: "Active Restaurant" },
  ];

  return (
    <>
      <section className="w-full mx-auto px-4 py-[76px] md:py-[100px] flex flex-col lg:flex-row gap-4 md:gap-12 justify-center items-center max-w-screen-2xl">
        {/* left div - Image */}

        <div className="w-full h-1/2 md:h-full md:w-3/4 lg:w-[45%] xl:w-[50%] flex flex-col md:flex-row justify-center items-center">
          <div className="relative border-t-4 border-dashed border-amber-300 rounded-full flex justify-center items-center
           w-full h-[350px]
           md:h-[570px] xl:h-[600px] 2xl:h-[650px]">
            <div className="w-[513px] h-[508px] xl:w-[550px] xl:h-[550px] 2xl:w-[600px] 2xl:h-[600px] rounded-full flex justify-center items-">
              <Image
                src={img}
                alt="image"
                width={513}
                height={508}
                className="absolute md:top-10 md:left-8 lg:left-10 xl:left-12 2xl:left-16
                top-[40px] left-[20px]
                
                md:w-[513px] md:h-[508px]
                xl:w-[550px] xl:h-[550px]
                2xl:w-[600px] 2xl:h-[600px]
                w-[250px] h-[250px]
                "
              />
            </div>
            <div >
              <Image
                src="/image/landingPageImages/rice.png"
                alt="About Shirley's"
                width={100}
                height={100}
                className="absolute  z-50
                w-[50px]  h-[50px]
                md:w-[100px] md:h-[100px]
                top-8 left-0
                md:top-[20px] md:left-[40px]
                "
              />
              <Image
                src="/image/landingPageImages/biryani.png"
                alt="About Shirley's"
                width={100}
                height={100}
                className=" absolute  z-50
                top-[25px]  right-[25px]
                w-[50px]  h-[50px]
                md:w-[100px] md:h-[100px]"
              />
              <Image
                src="/image/landingPageImages/rice1.png"
                alt="About Shirley's"
                width={136}
                height={135}
                className="absolute top-[-40px]  left-[110px] 
                md:top-[-100px]  md:left-[250px]
                md:h-[135px] md:w-[135px]
                h-20 w-20
                "
              />
              <Image
                src="/image/landingPageImages/leaf1.png"
                alt="About Shirley's"
                width={60}
                height={58}
                className="absolute top-2  left-4 
                md:top-0  md:left-[86px] 
                md:h-[58px] md:w-[60px]
                h-10 w-10"
              />
              <Image
                src="/image/landingPageImages/lemon1.png"
                alt="About Shirley's"
                width={60}
                height={58}
                className="absolute top-[20px]  right-[35px] 
                md:top-[20px]  md:right-[105px]
                md:h-[58px] md:w-[60px]
                h-10 w-10
                "
              />
            </div>
          </div>
        </div>

        {/* right div - text */}
        <div className="w-full md:w-1/2 space-y-8">
          <div className="flex gap-4">
            <div className="w-2 bg-[#F3C03F] rounded"></div>
            <h2 className="text-3xl md:text-4xl font-bold">
              From Family Table to Your Kitchen
            </h2>
          </div>

          <p className="text-lg md:text-xl text-gray-700">
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
            className="flex items-center gap-2 bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] border-2 border-[#FFD56A] shadow-inner rounded-full px-8 py-4 w-fit text-xl font-medium"
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
