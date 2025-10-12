'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GetProductBySlugResponse } from '@/src/lib/api/customer';
import formatDisplayCurrency from '@/utils/helpers/formatDisplayCurrency';

type Props = {
  product: GetProductBySlugResponse;
  onAddToCart?: (variant: {
    variant: GetProductBySlugResponse['productVariants'][number];
    quantity: number;
  }) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Demo({ product, onAddToCart }: Props) {
  const { name, productVariants, variantOptions } = product || {};

  const isOutOfStock = productVariants?.every(item => item.stock === 0);

  // --- state ---
  const [selectedOptions, setSelectedOptions] = React.useState<
    Record<number, number | null>
  >(() => Object.fromEntries(variantOptions.map(opt => [opt.id, null])));
  const [quantity, setQuantity] = React.useState(1);

  // --- tìm variant phù hợp ---
  const matchedVariants = React.useMemo(() => {
    const selectedIds = Object.values(selectedOptions).filter(Boolean);
    if (selectedIds.length === 0) return productVariants;

    return productVariants.filter(variant =>
      selectedIds.every(id => variant?.variantOptionIds.includes(id as number))
    );
  }, [selectedOptions, productVariants]);

  // --- giá hiển thị ---
  const displayPrice =
    matchedVariants.length === 1
      ? matchedVariants[0].price
      : Math.min(...productVariants.map(v => v.price));

  const displayCompare =
    matchedVariants.length === 1
      ? matchedVariants[0].compareAtPrice
      : Math.max(...productVariants.map(v => v.compareAtPrice));

  // --- disable logic ---
  const disabledOptions = React.useMemo(() => {
    const result = new Set<number>();
    variantOptions.forEach(group => {
      group.options.forEach(opt => {
        const hypotheticalSelection = {
          ...selectedOptions,
          [group.id]: opt.id,
        };
        const selectedIds = Object.values(hypotheticalSelection).filter(
          Boolean
        );
        const valid = productVariants.some(
          v =>
            selectedIds.every(id =>
              v?.variantOptionIds.includes(id as number)
            ) && v.stock > 0
        );
        if (!valid) result.add(opt.id);
      });
    });
    return result;
  }, [selectedOptions, productVariants, variantOptions]);

  // --- toggle chọn option ---
  const toggleOption = (groupId: number, optionId: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [groupId]: prev[groupId] === optionId ? null : optionId,
    }));
  };

  // --- handler Add To Cart ---
  const handleAddToCart = () => {
    try {
      const selectedIds = Object.values(selectedOptions).filter(Boolean);

      if (selectedIds.length !== variantOptions.length) {
        toast.error(
          'Please select all available product options before adding to cart.'
        );
        return;
      }

      const matched = productVariants.find(v =>
        selectedIds.every(id => v?.variantOptionIds.includes(id as number))
      );
      if (!matched) {
        toast.error('The selected combination is currently unavailable.');
        return;
      }

      if (quantity > matched.stock) {
        toast.error(`Only ${matched.stock} item(s) left in stock.`);
        return;
      }

      //   toast.success('Added to cart');

      //   onAddToCart?.({ variant: matched, quantity });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-3 md:gap-4">
        <h2 className="text-xl font-bold capitalize md:text-[40px]">{name}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold md:text-[40px]">
            {' '}
            {formatDisplayCurrency(displayPrice)}
          </span>
          <span className="text-lg text-gray-500 line-through md:text-[35px]">
            {formatDisplayCurrency(displayCompare)}
          </span>
        </div>
        {isOutOfStock && (
          <div className="text-sm font-semibold text-red-600">Out of Stock</div>
        )}
        {/* <p className="text-base lg:text-xl">
          Earthy and aromatic with deep herbal notes that transform any lamb
          dish into something extraordinary. This premium Lamb Jollof Paste
          features carefully selected spices that mirror pastoral imagery and
          fresh herbs traditionally used in lamb preparation. Perfect for slow
          cooking, special occasions, or when you want that extra layer of
          authenticity. Each vegan and halal-friendly jar brings
          professional-quality results to your kitchen.
        </p> */}
      </div>

      {/* VARIANT OPTIONS */}
      {variantOptions.map(group => (
        <div key={group.id} className="space-y-4">
          <div className="text-base font-semibold md:text-xl">{group.name}</div>
          <div className="flex flex-wrap gap-2">
            {group.options.map(opt => {
              const selected = selectedOptions[group.id] === opt.id;
              const disabled = isOutOfStock || disabledOptions.has(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    if (disabled) return;
                    toggleOption(group.id, opt.id);
                  }}
                  className={cn(
                    selected
                      ? 'btn-gradient--yellow'
                      : !disabled
                        ? 'text-opacity-90 hover:text-opacity-100 bg-[#E4E4E4] text-black hover:bg-[#F3C03F] hover:text-black'
                        : '',
                    'block rounded-full border-[2px] border-transparent px-6 py-2 text-base font-semibold whitespace-nowrap !shadow-none transition-all duration-100 hover:cursor-pointer sm:px-5 sm:py-2 sm:text-sm lg:px-6 lg:py-2 lg:text-base xl:text-lg',
                    disabled && '!cursor-not-allowed opacity-30'
                  )}
                >
                  {opt.value}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* QUANTITY SELECTOR */}

      <div className="mt-4 flex flex-col gap-8 md:flex-row md:items-center md:gap-3">
        <div className="flex min-w-[160px] items-center rounded-md border border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-none border-r border-gray-200 p-0 hover:bg-gray-50"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-3 w-3" />
            <span className="sr-only">Decrease quantity</span>
          </Button>

          <span className="min-w-[2rem] flex-1 px-3 py-1 text-center text-lg font-bold text-gray-900">
            {quantity}
          </span>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-none border-l border-gray-200 p-0 hover:bg-gray-50"
            onClick={() => setQuantity(q => Math.max(1, q + 1))}
          >
            <Plus className="h-3 w-3" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
        <Button
          className="btn-gradient--yellow flex-1 !text-lg !font-semibold hover:opacity-80"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          Add To Cart
        </Button>
      </div>
    </div>
  );
}
