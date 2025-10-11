import { mission, MissionData } from "@/constants/about/mission";

import Image from "next/image";
import React from "react";
import About from "../landing/about";

function MissionSection() {
  return (
    <>
    <div className="w-full relative px-6 mx-auto bg-[#f5f5f5] ">
      <div className="absolute w-[62px] h-[86px] md:w-[170px] md:h-[205px] top-0 right-0">
        <Image
          src="/image/aboutImages/capsicum.png"
          alt="capsicum"
          width={170}
          height={205}
          className="object-center rounded-lg"
          priority
        />
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8   ">
        {/* Image on the left */}

        <div className="relative w-[278px] md:w-1/2 h-[250px] md:h-[400px] lg:h-[840px]  rounded-lg overflow-hidden">
          <Image
            src="/image/aboutImages/montage.jpeg"
            alt="Shirley's Jollof Paste"
            layout="fill"
            className="object-center rounded-lg"
            priority
          />
        </div>

        {/* mission text events */}
        <div className="w-full lg:w-3/5 p-3 space-y-12 md:space-y-16 lg:space-y-18">
          <h2 className="text-3xl md:text-4xl lg:text-[45px] font-bold">
            Overview
          </h2>

          <div className="space-y-8 md:space-y-12">
            {/* Mission point 1 */}

            {mission.map((item: MissionData, index) => {
              return (
                <div key={index} className="flex items-start gap-5">
                  <div className="relative w-24 h-24  rounded-full bg-black flex items-center justify-center  ">
                    <div className="relative w-16 h-16 ">
                      <Image
                        src={item.image}
                        alt="image"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <p className="text-xl md:text-2xl lg:text-[30px] leading-tight">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

            </div>

      <div
        className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[653px] 
                    overflow-hidden 
                    mt-8 sm:mt-12 md:mt-16 lg:mt-[99px] 
                    
                    relative"
      >
        <Image
          src="/image/aboutImages/1.jpg"
          alt="Hero image"
          fill
          sizes="(max-width: 640px) 100vw, 
               (max-width: 768px) 100vw, 
               (max-width: 1024px) 100vw, 
               100vw"
          priority
          className="object-cover"
        />
      </div>
    </div>
      <About img="/image/aboutImages/girl.png" />
      </>
  );
}

export default MissionSection;
