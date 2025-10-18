'use client';

import { GetProductBySlugResponse } from '@/src/lib/api/customer';
import { useState } from 'react';
import ProductDetailMainInfo from './ProductDetailMainInfo';
import ProductImageSlider from './ProductImageSlider';

type Props = {
  data: GetProductBySlugResponse;
};
export default function ProductDetail({ data }: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const handleVariantImageChange = (imageIndex: number) => {
    setSelectedImageIndex(imageIndex);
  };

  return (
    <div className="container pb-7">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
        <ProductImageSlider
          images={data?.images}
          externalSelectedIndex={selectedImageIndex}
          onIndexChange={setSelectedImageIndex}
        />
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="hidden items-center justify-center lg:flex">
            <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
              Product Details
            </h1>
          </div>

          <ProductDetailMainInfo
            product={data}
            onVariantImageChange={handleVariantImageChange}
          />
        </div>
      </div>
    </div>
  );
}
