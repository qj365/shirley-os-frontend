import { TimelineData, timelineData } from "@/constants/about/timeline";
import Image from "next/image";
import React from "react";

function TimelineSection() {
  return (
    <div className="w-full  mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14  ">
        {/* Image on the left */}
        <div className="w-full lg:w-2/5">
          <div className="mx-auto relative w-full  h-[400px] md:h-[600px] lg:h-[840px] rounded-lg overflow-hidden">
            <Image
              src="/image/aboutImages/chef.png"
              alt="Shirley's Jollof Paste"
              layout="fill"
              className="object-contain rounded-lg"
              priority
            />
          </div>
        </div>

        {/* Timeline on the right */}
        <div className="w-full lg:w-3/5 relative ">
          {/* Vertical line */}
          <div className="absolute left-3 md:left-4 top-0 bottom-0 w-0.5 bg-[#FFC020] "></div>

          {/* Timeline events */}
          <div className="space-y-12 md:space-y-16  ">
            {timelineData.map((item: TimelineData, index) => (
              <div key={index} className="flex flex-col gap-4 ">
                {/* Year with circle */}
                <div className="flex  items-center gap-4">
                  <div className="md:w-8 md:h-8 w-6 h-6 rounded-full  bg-[#FFC020] flex-shrink-0"></div>
                  <div className="text-[#FFC020] flex items-center  justify-center font-semibold text-xl md:text-2xl lg:text-2xl ">
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
                <div className="md:ml-8 space-y-2 p-6 md:p-0">
                  <h3 className="font-semibold text-2xl md:text-3xl lg:text-4xl">
                    {item.title}
                  </h3>
                  <p className="text-lg md:text-xl lg:text-2xl">
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
