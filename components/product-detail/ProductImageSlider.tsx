'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImagePreviewModal from './ImagePreviewModal';

type Props = {
  images: string[];
  alt?: string;
  externalSelectedIndex?: number;
  onIndexChange?: (index: number) => void;
};

export default function ProductImageSlider({
  images,
  alt = 'Gallery image',
  externalSelectedIndex,
  onIndexChange,
}: Props) {
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  // State for carousel APIs
  const [mainApi, setMainApi] = React.useState<CarouselApi>();
  const [thumbApi, setThumbApi] = React.useState<CarouselApi>();

  // State for image preview modal
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [previewIndex, setPreviewIndex] = React.useState(0);

  // Use externalSelectedIndex as the source of truth, fallback to 0
  const selectedIndex = externalSelectedIndex ?? 0;

  // Update carousel when external index changes
  React.useEffect(() => {
    if (mainApi && externalSelectedIndex !== undefined) {
      const currentIndex = mainApi.selectedScrollSnap();
      if (externalSelectedIndex !== currentIndex) {
        mainApi.scrollTo(externalSelectedIndex);
      }
    }
  }, [externalSelectedIndex, mainApi]);

  // Handle main carousel selection
  React.useEffect(() => {
    if (!mainApi) return;

    const handleSelect = () => {
      const index = mainApi.selectedScrollSnap();
      thumbApi?.scrollTo(index);
      setCanScrollPrev(mainApi.canScrollPrev());
      setCanScrollNext(mainApi.canScrollNext());
      onIndexChange?.(index);
    };

    // Initialize scroll state
    setCanScrollPrev(mainApi.canScrollPrev());
    setCanScrollNext(mainApi.canScrollNext());

    mainApi.on('select', handleSelect);

    return () => {
      mainApi.off('select', handleSelect);
    };
  }, [mainApi, thumbApi, onIndexChange]);

  const scrollTo = (index: number) => {
    mainApi?.scrollTo(index);
    onIndexChange?.(index);
  };

  // Handle image click to open preview modal
  const handleImageClick = (index: number) => {
    setPreviewIndex(index);
    setIsPreviewOpen(true);
  };

  // Handle preview modal index change
  const handlePreviewIndexChange = (index: number) => {
    setPreviewIndex(index);
    // Also update the main carousel if needed
    mainApi?.scrollTo(index);
    onIndexChange?.(index);
  };

  // Handle preview modal close
  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
  };

  return (
    <div className="w-full select-none">
      {/* MAIN CAROUSEL */}
      <Carousel
        opts={{ loop: false, align: 'center' }}
        setApi={setMainApi}
        className="relative w-full"
      >
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem key={`${img}+${index}`} className="aspect-square">
              <div
                className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-[#ffedc3] transition-colors hover:bg-[#ffd700]"
                onClick={() => handleImageClick(index)}
              >
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

        {/* Custom arrows with Chevron icons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-[4px] z-10 size-10 -translate-y-1/2 rounded-full border-none bg-transparent shadow-md hover:bg-amber-50 disabled:pointer-events-none disabled:opacity-50"
          onClick={() => mainApi?.scrollPrev()}
          disabled={!canScrollPrev}
        >
          <ChevronLeft className="size-8 text-gray-800" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <Button
          variant="outline"
          className="absolute top-1/2 right-[4px] z-10 size-10 -translate-y-1/2 rounded-full border-none bg-transparent shadow-md hover:bg-amber-50 disabled:pointer-events-none disabled:opacity-50"
          onClick={() => mainApi?.scrollNext()}
          disabled={!canScrollNext}
        >
          <ChevronRight className="size-8 text-gray-800" />
          <span className="sr-only">Next slide</span>
        </Button>
      </Carousel>

      {/* THUMBNAIL CAROUSEL */}
      <div className="mt-3">
        <Carousel
          opts={{
            align: 'start',
            containScroll: 'trimSnaps',
            dragFree: true,
            loop: false,
          }}
          setApi={setThumbApi}
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

      {/* Image Preview Modal */}
      <ImagePreviewModal
        images={images}
        currentIndex={previewIndex}
        isOpen={isPreviewOpen}
        onClose={handlePreviewClose}
        onIndexChange={handlePreviewIndexChange}
        alt={alt}
      />
    </div>
  );
}
