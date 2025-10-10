import Image from "next/image"
import { type BarData, yellowBarData } from "@/constants/landing/yellow-bar"

function YellowBar() {
  return (
    <section
      className="w-full flex flex-row flex-wrap justify-center 
                sm:gap-8 md:gap-6 lg:gap-20 
                py-8 sm:py-12
                bg-amber-400 overflow-hidden 
                mb-8 sm:mb-10 md:mb-16"
    >
      {yellowBarData.map((item: BarData, index) => {
        return (
          <div
            key={index}
            className="flex flex-col gap-2 xs:gap-3 sm:gap-[15px] 
              items-center justify-center 
              w-[45%] xsm:w-[42%] xs:w-[40%] sm:w-[30%] md:w-auto
              py-3 xsm:py-4 sm:py-6 md:py-0"
          >
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              width={82}
              height={82}
              className="w-12 h-12 xsm:w-14 xsm:h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-20 md:h-20"
              priority
            />
            <p className="text-base xsm:text-sm xs:text-base sm:text-lg md:text-lg font-semibold text-center">
              {item.title}
            </p>
          </div>
        )
      })}
    </section>
  )
}

export default YellowBar
