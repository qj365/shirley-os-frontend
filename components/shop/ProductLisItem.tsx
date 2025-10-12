'use client';

import { GetProductsByCategoryResponse } from '@/src/lib/api/customer';
import formatDisplayCurrency from '@/utils/helpers/formatDisplayCurrency';
import Link from 'next/link';
import { ImageWithFallback } from '../ui/image-with-fallback';

interface Props {
  product: GetProductsByCategoryResponse;
}

export default function ProductListItem({ product }: Props) {
  // Get the primary image or first available image

  //   const [isCartOpen, setIsCartOpen] = useState(false);
  //   const { addItem, formatPrice } = useCart();

  // Get the first variant and its price
  //   const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;

  // Calculate display price (in pounds)
  //   const minimum_quantity = 3
  //   const displayPrice = (firstVariant?.calculated_price?.calculated_amount || 0) * minimum_quantity

  // Construct product detail link
  const productDetailUrl = `/shop/${product?.slug}`;

  //   const handleAddToCart = () => {
  //     if (firstVariant) {
  //       addItem(firstVariant.id, 1);
  //       setIsCartOpen(true);
  //     }
  //   };

  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-lg`}
    >
      <Link href={productDetailUrl} className="block">
        <div className="relative flex aspect-[4/3] cursor-pointer justify-center rounded-t-xl bg-[#ffedc3] transition-colors hover:bg-[#ffd700]">
          <ImageWithFallback
            key={product?.image || ''}
            src={product?.image || ''}
            alt={product?.name}
            width={400}
            height={300}
            className="h-full w-full rounded object-contain p-4 sm:p-6 md:p-8"
          />
        </div>
      </Link>

      <div className="flex flex-grow flex-col p-3 sm:p-4">
        <h3 className="mb-2 line-clamp-2 text-base font-semibold sm:text-2xl">
          {product?.name}
        </h3>

        <div className="mb-3 flex flex-wrap items-center gap-2 text-[#7C7C7C] sm:mb-4">
          <span className="text-base font-bold sm:text-lg">
            From{' '}
            <span className="text-xl text-black sm:text-2xl">
              {formatDisplayCurrency(product?.price)}
            </span>
          </span>
          <span className="text-xs line-through sm:text-base">
            {formatDisplayCurrency(product?.compareAtPrice)}{' '}
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-2 sm:flex-row">
          {/* <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full rounded-full bg-black px-1 py-2 text-sm text-white capitalize transition active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Add to cart
            </button>
          </CartSheet> */}

          <Link href={productDetailUrl} className="w-full">
            <button className="w-full rounded-full border border-black px-1 py-2 text-sm font-semibold text-black capitalize transition hover:bg-black hover:text-white active:scale-95 sm:text-lg">
              View Product
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
