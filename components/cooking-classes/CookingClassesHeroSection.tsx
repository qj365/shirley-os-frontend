'use client';

import React from 'react';

type Props = {
  bgUrl?: string;
  showOverLay?: boolean;
};

function CookingClassesHeroSection({ bgUrl, showOverLay }: Props) {
  return (
    <div
      className="relative h-[300px] w-full bg-cover bg-center sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[703px]"
      style={{
        backgroundImage: `url(${bgUrl || '/image/cooking_classes_hero_image.png'})`,
      }}
    >
      {!!showOverLay && <div className="absolute inset-0 bg-black/20"></div>}
    </div>
  );
}

export default CookingClassesHeroSection;
