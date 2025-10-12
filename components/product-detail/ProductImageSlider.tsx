/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

type Props = {
  images: string[];
  alt?: string;
};

export default function ImageGallery({ images, alt = 'Gallery image' }: Props) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // refs cho main & thumbnail carousel
  const mainCarouselRef = React.useRef<any>(null);
  const thumbCarouselRef = React.useRef<any>(null);

  // khi main carousel thay đổi -> cập nhật thumbnail scroll + state
  const handleMainSelect = React.useCallback((emblaApi: any) => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    thumbCarouselRef.current?.scrollTo(index);
  }, []);

  // click thumbnail -> scroll main tới index đó
  const scrollTo = (index: number) => {
    setSelectedIndex(index);
    mainCarouselRef.current?.scrollTo(index);
  };

  return (
    <div className="w-full select-none">
      {/* MAIN CAROUSEL */}
      <Carousel
        opts={{ loop: true, align: 'center' }}
        setApi={api => {
          mainCarouselRef.current = api;
          if (api) api.on('select', () => handleMainSelect(api));
        }}
        className="w-full"
      >
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem key={`${img}+${index}`} className="aspect-square">
              <div className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-[#ffedc3]">
                <Image
                  key={`${img}+${index}`}
                  src={img}
                  alt={`${alt} ${index + 1}`}
                  width={400}
                  height={300}
                  className="h-full w-full object-contain p-4 sm:p-6 md:p-8"
                  draggable={false}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* arrows */}
        <CarouselPrevious className="left-1 bg-white hover:bg-amber-50" />
        <CarouselNext className="right-1 bg-white hover:bg-amber-50" />
      </Carousel>

      {/* THUMBNAIL CAROUSEL */}
      <div className="mt-3">
        <Carousel
          opts={{
            align: 'start',
            containScroll: 'trimSnaps',
            dragFree: true,
          }}
          setApi={api => (thumbCarouselRef.current = api)}
          className="max-w-full"
        >
          <CarouselContent className="flex items-center justify-center gap-2">
            {images.map((img, index) => (
              <CarouselItem
                key={`${img}+${index}`}
                className="basis-auto cursor-pointer"
                onClick={() => scrollTo(index)}
              >
                <div
                  className={cn(
                    'relative h-16 w-16 overflow-hidden rounded-md border bg-[#ffd700] transition-all duration-75',
                    selectedIndex === index
                      ? 'border-2 border-[#ffd700]'
                      : 'border-2 border-white opacity-70 hover:opacity-100'
                  )}
                >
                  <Image
                    key={`${img}+${index}`}
                    src={img}
                    alt={`${alt} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                    draggable={false}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
