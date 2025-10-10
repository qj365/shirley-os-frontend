import { type Grid, gridData } from '@/constants/wholesale-data/grid-data';
import Image from 'next/image';

export default function WholesaleGrid() {
  return (
    <div className="w-full bg-[#f8f8fa]">
      <div className="container mb-[39px] grid h-auto grid-cols-1 gap-[20px] py-[40px] sm:gap-[35px] sm:py-[80px] lg:grid-cols-2">
        {/* product Card */}
        {gridData.map((item: Grid, index: number) => {
          return (
            <div
              key={index}
              className="relative mx-auto flex h-auto w-full max-w-[767px] flex-row overflow-hidden rounded-[20px] bg-white shadow-[0px_1px_6px_rgba(148,147,239,0.19)]"
            >
              {/* Left yellow section with product image */}
              <div className="relative h-auto w-[190px] bg-[#FFEDC3] sm:w-[210px] md:w-[305px]">
                {/* Discount badge */}
                <div className="absolute top-[20px] left-0 flex items-center rounded-r-[24px] bg-[#FAC02F] py-[5px] pr-[15px] pl-[8px] sm:top-[39px] sm:py-[7px] sm:pr-[20px] sm:pl-[10px]">
                  <span className="text-[10px] font-medium text-white sm:text-[14px]">
                    {item.off}
                  </span>
                </div>

                {/* Product image */}
                <div className="absolute bottom-0 h-[160px] w-full sm:h-[238px] sm:w-[348px] md:left-[-50px] md:h-[210px] md:w-[300px]">
                  {' '}
                  {/* Adjust width and height for md */}
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={200}
                    height={110}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Yellow blur effect */}
                <div className="absolute bottom-[20px] left-1/2 h-[15px] w-[200px] -translate-x-1/2 bg-[#F3C03F] blur-[21.5px] sm:bottom-[32px] sm:h-[21px] sm:w-[266px]"></div>
              </div>

              {/* Right content section */}
              <div className="flex w-full flex-col gap-2 p-3 sm:gap-4 sm:p-4 md:gap-[17px] md:p-[15px] md:pl-6">
                {/* Product title */}
                <h2 className="text-lg leading-tight font-semibold text-black sm:text-2xl md:text-[24px] md:leading-[42px]">
                  {item.name}
                </h2>

                {/* Product details */}
                <div className="flex flex-col gap-1 sm:gap-2 md:gap-[7px]">
                  {/* Pack size */}
                  <div className="flex items-center gap-1 md:gap-[4px]">
                    <Image src="/image/pack.png" alt="pack" width={16} height={16} />
                    <span className="text-sm font-medium text-[#7C7C7C] sm:text-lg md:text-[20px]">
                      {item.text1}
                    </span>
                  </div>

                  {/* Delivery info */}
                  <div className="flex items-center gap-1 md:gap-[4px]">
                    <Image src="/image/clock.png" alt="clock" width={16} height={16} />
                    <span className="text-sm font-medium text-[#7C7C7C] sm:text-lg md:text-[20px]">
                      {item.text2}
                    </span>
                  </div>

                  {/* Ratings */}
                  <div className="flex items-center gap-1 md:gap-[6px]">
                    <div className="flex items-center">
                      <Image src="/image/star.png" alt="star" width={16} height={16} />
                      <span className="text-sm font-medium text-[#7C7C7C] sm:text-lg md:text-[20px]">
                        {item.text3}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-start gap-1 md:gap-[5px]">
                  <span className="text-lg font-semibold text-black sm:text-2xl md:text-[28px]">
                    £{item.newPrice}
                  </span>
                  <span className="text-base font-normal text-[#7C7C7C] line-through sm:text-xl md:text-[24px]">
                    £{item.oldPrice}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
