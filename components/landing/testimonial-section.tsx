import {
  testimonials,
  TestimonialType,
} from '@/constants/landing/testimonial-data';
import { Star } from 'lucide-react';
import Image from 'next/image';

export default function TestimonialsSection() {
  return (
    <section className="relative w-full bg-cover lg:bg-[url('/image/landingPageImages/dashed-line.png')]">
      {/* Background overlay (if needed) */}
      <div className="absolute inset-0 z-0 bg-white/50"></div>

      <div className="relative z-10 container flex w-full flex-col items-center gap-9 pt-0 md:pt-[170px] md:pb-[80px]">
        {/* Heading */}
        <h2 className="max-w-xl text-center text-3xl leading-tight font-bold sm:text-3xl md:text-4xl lg:text-5xl">
          Loved by individuals across the globe
        </h2>

        {/* Testimonials */}
        <div className="xsm:grid-cols-1 xs:grid-cols-1 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item: TestimonialType, index: number) => (
            <div key={index} className="relative">
              {/* Quote icon */}
              <div className="absolute -top-7 left-6 z-30 flex h-[74px] w-[74px] items-center justify-center rounded-full bg-black">
                <Image
                  src="/image/landingPageImages/commas.png"
                  alt="comma"
                  height={50}
                  width={50}
                />
              </div>

              {/* Card */}
              <div className="rounded-lg border border-[#ECECEC] bg-white px-5 pt-16 pb-6">
                {/* Stars */}
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-7 w-7 fill-[#FFBA0A] text-[#FFBA0A]"
                    />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="mb-4 leading-relaxed font-normal">{item.text}</p>

                {/* Author info */}
                <div className="flex items-center gap-2">
                  <div className="h-[65px] w-[65px] rounded-full bg-[#F3F3F3]">
                    <Image
                      src={item.image}
                      alt={item.author}
                      width={65}
                      height={65}
                    />
                  </div>
                  <div>
                    <p className="text-xl font-medium">{item.author}</p>
                    <p className="text-base text-[#8A8A8A]">{item.location}</p>
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
