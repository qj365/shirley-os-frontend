'use client';

import { GetProductBySlugResponse } from '@/src/lib/api/customer';
import ProductDetailMainInfo from './ProductDetailMainInfo';
import ProductImageSlider from './ProductImageSlider';

type Props = {
  data: GetProductBySlugResponse;
};
export default function ProductDetail({ data }: Props) {
  console.log(data, '______');
  return (
    <div className="container pb-7">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-20">
        <ProductImageSlider images={data?.images} />
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="hidden items-center justify-center lg:flex">
            <h1 className="text-2xl font-bold md:text-[45px]">
              Product Details
            </h1>
          </div>

          <ProductDetailMainInfo product={data} />
        </div>
      </div>

      <section className="pt-7 md:pt-10">
        <h2 className="text-xl font-bold capitalize md:text-3xl">
          Product Description
        </h2>
        <div dangerouslySetInnerHTML={{ __html: data?.description || '' }} />
      </section>
    </div>
  );
}
