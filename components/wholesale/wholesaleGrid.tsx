import { type Grid, gridData } from "@/constants/wholesale-data/grid-data"
import Image from "next/image"

export default function WholesaleGrid() {
  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px] sm:gap-[35px] py-[40px] sm:py-[80px] px-4 mb-[39px] h-auto bg-[#f8f8fa]">
        {/* product Card */}
        {gridData.map((item: Grid, index: number) => {
          return (
            <div
              key={index}
              className="relative mx-auto w-full max-w-[767px] h-auto bg-white rounded-[20px] shadow-[0px_1px_6px_rgba(148,147,239,0.19)] overflow-hidden flex flex-row"
            >
              {/* Left yellow section with product image */}
              <div className="relative w-[190px] sm:w-[210px] md:w-[305px] h-auto bg-[#FFEDC3]">
                {/* Discount badge */}
                <div className="absolute top-[20px] sm:top-[39px] left-0 flex items-center py-[5px] sm:py-[7px] pl-[8px] sm:pl-[10px] pr-[15px] sm:pr-[20px] bg-[#FAC02F] rounded-r-[24px]">
                  <span className="text-white font-medium text-[10px] sm:text-[14px]">{item.off}</span>
                </div>

                {/* Product image */}
                <div className="absolute bottom-0 md:left-[-50px] w-full sm:w-[348px] h-[160px] sm:h-[238px] md:w-[300px] md:h-[210px]"> {/* Adjust width and height for md */}
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={200}  
                    height={110}  
                    className="object-contain w-full h-full"
                  />
                </div>

                {/* Yellow blur effect */}
                <div className="absolute bottom-[20px] sm:bottom-[32px] left-1/2 -translate-x-1/2 w-[200px] sm:w-[266px] h-[15px] sm:h-[21px] bg-[#F3C03F] blur-[21.5px]"></div>
              </div>

              {/* Right content section */}
              <div className="p-3 sm:p-4 md:p-[15px] md:pl-6 flex flex-col gap-2 sm:gap-4 md:gap-[17px] w-full">
                {/* Product title */}
                <h2 className="font-semibold text-lg sm:text-2xl md:text-[24px] leading-tight md:leading-[42px] text-black">
                  {item.name}
                </h2>

                {/* Product details */}
                <div className="flex flex-col gap-1 sm:gap-2 md:gap-[7px]">
                  {/* Pack size */}
                  <div className="flex items-center gap-1 md:gap-[4px]">
                    <Image src="/image/pack.png" alt="pack" width={16} height={16} />
                    <span className="text-[#7C7C7C] font-medium text-sm sm:text-lg md:text-[20px]">{item.text1}</span>
                  </div>

                  {/* Delivery info */}
                  <div className="flex items-center gap-1 md:gap-[4px]">
                    <Image src="/image/clock.png" alt="clock" width={16} height={16} />
                    <span className="text-[#7C7C7C] font-medium text-sm sm:text-lg md:text-[20px]">{item.text2}</span>
                  </div>

                  {/* Ratings */}
                  <div className="flex items-center gap-1 md:gap-[6px]">
                    <div className="flex items-center">
                      <Image src="/image/star.png" alt="star" width={16} height={16} />
                      <span className="text-[#7C7C7C] font-medium text-sm sm:text-lg md:text-[20px]">{item.text3}</span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-1 md:gap-[5px] justify-start">
                  <span className="font-semibold text-lg sm:text-2xl md:text-[28px] text-black">£{item.newPrice}</span>
                  <span className="font-normal text-base sm:text-xl md:text-[24px] text-[#7C7C7C] line-through">
                    £{item.oldPrice}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
