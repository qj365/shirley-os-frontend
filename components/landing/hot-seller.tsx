"use client"

import Image from "next/image"
import { type Hotseller, hotSeller } from "@/constants/landing/hot-seller"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { useMediaQuery } from "./hook"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

function HotSeller() {
  const isXSmall = useMediaQuery("(max-width: 399px)")
  const isMobile = useMediaQuery("(max-width: 639px)")
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)")
  const isXLarge = useMediaQuery("(min-width: 1536px)")
  const router = useRouter()

  // State for carousel API
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  // Update current index when the carousel changes
  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const carouselOptions = {
    align: "start" as const,
    slidesPerView: isMobile ? 1 : isTablet ? 2 : isXLarge ? 4 : 3,
    spaceBetween: isMobile ? 10 : isXLarge ? 15 : 20,
  }

  // Function to handle card click and navigate to the shop page
  const handleCardClick = (item: Hotseller) => {
    // Create URL with category parameter
    let url = `/shop?category=${encodeURIComponent(item.category)}`
    
    // Add flavor parameter if available
    if (item.flavour) {
      url += `&flavour=${encodeURIComponent(item.flavour)}`
    }
    
    // Navigate to the shop page
    router.push(url)
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col gap-6 py-10 max-w-screen-2xl mx-auto">
      {/* Hot Sellers Section with Navigation */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <h2 className="text-xl xsm:text-2xl sm:text-3xl font-bold">OUR HOT SELLERS</h2>
          <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#fabc20] rounded-full"></div>
        </div>

        {/* Custom navigation arrows in top-right */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full border-2 border-[#fabc20] text-[#fabc20] hover:bg-[#fabc20] hover:text-white transition-colors"
            onClick={() => api?.scrollPrev()}
            disabled={current === 0}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full border-2 border-[#fabc20] text-[#fabc20] hover:bg-[#fabc20] hover:text-white transition-colors"
            onClick={() => api?.scrollNext()}
            disabled={current === count - 1}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>
      </div>

      <div className="w-full">
        {/* Carousel - Responsive configuration with API connection */}
        <Carousel opts={carouselOptions} className="w-full" setApi={setApi}>
          <CarouselContent className="-ml-2 md:-ml-4">
            {hotSeller.map((item: Hotseller, index: number) => (
              <CarouselItem
                key={index}
                className={isMobile ? "pl-2 basis-full" : isTablet ? "pl-4 basis-1/2" : isXLarge ? "pl-4 basis-1/4" : "pl-4 basis-1/3"}
              >
                <div 
                  className="group cursor-pointer"
                  onClick={() => handleCardClick(item)}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 group-hover:shadow-xl">
                    {/* Card content */}
                    <div className="bg-white p-6 flex flex-col items-center">
                      {/* Image with circular background */}
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-[#fabc20]/10 rounded-full transform scale-110"></div>
                        <div className="relative z-10 w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            width={140}
                            height={140}
                            className="w-full h-full object-contain"
                            priority
                          />
                        </div>
                      </div>
                      
                      {/* Product info */}
                      <div className="text-center">
                        <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-1">{item.title}</h3>
                        <p className="text-[#fabc20] font-medium">{item.subtitle}</p>
                        
                        {/* Price */}
                        {/* <div className="mt-3 flex items-center justify-center gap-2">
                          <span className="text-lg font-bold">{item.price}</span>
                          {item.oldPrice && (
                            <span className="text-sm text-gray-400 line-through">{item.oldPrice}</span>
                          )}
                        </div> */}
                      </div>
                    </div>
                    
                    {/* Bottom accent bar */}
                    <div className="h-2 bg-[#fabc20] w-full transform origin-left transition-all duration-300 group-hover:scale-x-110"></div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}

export default HotSeller
