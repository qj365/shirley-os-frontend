import { TimelineData, timelineData } from '@/constants/about/timeline';
import Image from 'next/image';
import React from 'react';

function TimelineSection() {
  return (
    <div className="container py-16 md:py-24">
      <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-14">
        {/* Image on the left */}
        <div className="w-full lg:w-2/5">
          <div className="relative mx-auto h-[400px] w-full overflow-hidden rounded-lg md:h-[600px]">
            <Image
              src="/image/aboutImages/chef.png"
              alt="Shirley's Jollof Paste"
              layout="fill"
              className="rounded-lg object-contain"
              priority
            />
          </div>
        </div>

        {/* Timeline on the right */}
        <div className="relative w-full max-w-[700px]">
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0 left-3 w-0.5 bg-[#FFC020] md:left-4"></div>

          {/* Timeline events */}
          <div className="space-y-8">
            {timelineData.map((item: TimelineData, index) => (
              <div key={index} className="flex flex-col gap-2">
                {/* Year with circle */}
                <div className="flex items-center gap-4">
                  <div className="h-6 w-6 flex-shrink-0 rounded-full bg-[#FFC020] md:h-8 md:w-8"></div>
                  <div className="flex items-center justify-center text-lg font-semibold text-[#FFC020] md:text-xl">
                    <Image
                      src="/image/aboutImages/yellowIcon.png"
                      alt="icon"
                      width={30}
                      height={30}
                    />
                    {/* <p>Year {item.year}</p> */}Year {item.year}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2 p-6 md:ml-8 md:p-0">
                  <h3 className="text-xl font-semibold md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="max-w-[550px] text-base md:text-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimelineSection;
