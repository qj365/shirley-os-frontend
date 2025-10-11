import {
  testimonials,
  TestimonialType,
} from "@/constants/landing/testimonial-data";
import { Star } from "lucide-react";
import Image from "next/image";

export default function TestimonialsSection() {
  return (
    <section className="relative w-full mb-20 bg-cover lg:bg-[url('/image/landingPageImages/dashed-line.png')]">
      {/* Background overlay (if needed) */}
      <div className="absolute inset-0 bg-white/50 z-0"></div>

      <div className="w-full md:pt-[170px] md:pb-[80px] pt-0 mx-auto flex flex-col items-center gap-9 relative z-10 px-6">
        {/* Heading */}
        <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center max-w-xl leading-tight">
          Love by individuals across the globe
        </h2>

        {/* Testimonials */}
        <div className="grid grid-cols-1 xsm:grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {testimonials.map((item: TestimonialType, index: number) => (
            <div key={index} className="relative">
              {/* Quote icon */}
              <div className="absolute -top-7 left-6 w-[74px] h-[74px] bg-black rounded-full flex items-center justify-center z-30">
                <Image
                  src="/image/landingPageImages/commas.png"
                  alt="comma"
                  height={50}
                  width={50}
                />
              </div>

              {/* Card */}
              <div className="border border-[#ECECEC] rounded-lg pt-16 pb-6 px-5 bg-white">
                {/* Stars */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-7 h-7 fill-[#FFBA0A] text-[#FFBA0A]"
                    />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="font-normal mb-4 leading-relaxed">{item.text}</p>

                {/* Author info */}
                <div className="flex items-center gap-2">
                  <div className="w-[65px] h-[65px] bg-[#F3F3F3] rounded-full">
                    <Image
                      src={item.image}
                      alt={item.author}
                      width={65}
                      height={65}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-xl">{item.author}</p>
                    <p className="text-[#8A8A8A] text-base">{item.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
