import { mission, MissionData } from '@/constants/about/mission';

import Image from 'next/image';
import React from 'react';
import About from '../landing/about';

function MissionSection() {
  return (
    <>
      <div className="relative mx-auto w-full bg-[#f5f5f5] px-6">
        <div className="absolute top-0 right-0 h-[86px] w-[62px] md:h-[205px] md:w-[170px]">
          <Image
            src="/image/aboutImages/capsicum.png"
            alt="capsicum"
            width={170}
            height={205}
            className="rounded-lg object-center"
            priority
          />
        </div>

        <div className="flex flex-col items-center gap-8 lg:flex-row">
          {/* Image on the left */}

          <div className="relative h-[250px] w-[278px] overflow-hidden rounded-lg md:h-[400px] md:w-1/2 lg:h-[840px]">
            <Image
              src="/image/aboutImages/montage.jpeg"
              alt="Shirley's Jollof Paste"
              layout="fill"
              className="rounded-lg object-center"
              priority
            />
          </div>

          {/* mission text events */}
          <div className="w-full space-y-12 p-3 md:space-y-16 lg:w-3/5 lg:space-y-18">
            <h2 className="text-3xl font-bold md:text-4xl lg:text-[45px]">
              Overview
            </h2>

            <div className="space-y-8 md:space-y-12">
              {/* Mission point 1 */}

              {mission.map((item: MissionData, index) => {
                return (
                  <div key={index} className="flex items-start gap-5">
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-black">
                      <div className="relative h-16 w-16">
                        <Image
                          src={item.image}
                          alt="image"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <p className="text-xl leading-tight md:text-2xl lg:text-[30px]">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative mt-8 h-[300px] w-full overflow-hidden sm:mt-12 sm:h-[400px] md:mt-16 md:h-[500px] lg:mt-[99px] lg:h-[653px]">
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
      <About img="/image/aboutImages/aboutUs.png" />
    </>
  );
}

export default MissionSection;
