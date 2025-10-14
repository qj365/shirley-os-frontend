'use client';

import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useMediaQuery } from '@/components/landing/hook';
import { Button } from '@/components/ui/button';
import { GetProductsByCategoryResponse } from '@/src/lib/api/customer';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductListItem from './ProductLisItem';
import { cn } from '@/lib/utils';
import EmptyShop from './EmptyShop';

export default function ProductsCarousel({
  categoryName,
  products,
}: {
  categoryName: string;
  products: GetProductsByCategoryResponse[];
}) {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isXLarge = useMediaQuery('(min-width: 1440px)');

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const slidesPerView = isMobile ? 1 : isTablet ? 2 : isXLarge ? 4 : 3;

  const carouselOptions = {
    align: 'start' as const,
    slidesPerView: slidesPerView,
    spaceBetween: isMobile ? 12 : isTablet ? 20 : 16,
  };

  // Update current index when the carousel changes
  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="mx-auto flex w-full flex-col gap-10">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold md:text-[25px]">{categoryName}</h2>

        {/* Custom navigation arrows in top-right */}
        {products?.length > slidesPerView && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-2 border-[#fabc20] text-[#fabc20] transition-colors hover:bg-[#fabc20] hover:text-white"
              onClick={() => api?.scrollPrev()}
              disabled={current === 0}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous slide</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-2 border-[#fabc20] text-[#fabc20] transition-colors hover:bg-[#fabc20] hover:text-white"
              onClick={() => api?.scrollNext()}
              disabled={current === count - 1}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next slide</span>
            </Button>
          </div>
        )}
      </div>

      {products?.length ? (
        <Carousel opts={carouselOptions} className="w-full" setApi={setApi}>
          <CarouselContent className="-ml-2 md:-ml-4">
            {(products || []).map(
              (item: GetProductsByCategoryResponse, index: number) => (
                <CarouselItem
                  key={index}
                  className={cn(
                    isMobile
                      ? 'basis-full pl-2'
                      : isTablet
                        ? 'basis-1/2 pl-4'
                        : isXLarge
                          ? 'basis-1/4 pl-4'
                          : 'basis-1/3 pl-4',
                    'pb-4'
                  )}
                >
                  <ProductListItem product={item} />
                </CarouselItem>
              )
            )}
          </CarouselContent>
        </Carousel>
      ) : (
        <EmptyShop />
      )}
    </section>
  );
}
