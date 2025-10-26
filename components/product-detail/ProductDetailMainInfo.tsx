'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GetProductBySlugResponse } from '@/src/lib/api/customer';
import formatDisplayCurrency from '@/utils/helpers/formatDisplayCurrency';
import { Minus, Plus } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import ProductDetailDescription from './ProductDetailDescription';
import { useCartStore } from '@/stores/cart-store';

type Props = {
  product: GetProductBySlugResponse;
  onVariantImageChange?: (imageIndex: number) => void;
  isFromCarousel?: boolean;
  currentSelectedImageIndex?: number;
};

export default function ProductDetailMainInfo({
  product,
  onVariantImageChange,
  isFromCarousel = false,
  currentSelectedImageIndex = 0,
}: Props) {
  const { name, productVariants, variantOptions, images, id } = product || {};
  const addItem = useCartStore(state => state.addItem);

  const isOutOfStock = productVariants?.every(
    item => item.stock < item.minOrder
  );

  // --- state ---
  const [selectedOptions, setSelectedOptions] = React.useState<
    Record<number, number | null>
  >(() => Object.fromEntries(variantOptions.map(opt => [opt.id, null])));
  const [quantity, setQuantity] = React.useState(1);

  const matchedVariants = React.useMemo(() => {
    const selectedIds = Object.values(selectedOptions).filter(Boolean);
    if (selectedIds.length === 0) return productVariants;

    return productVariants.filter(
      variant =>
        selectedIds.every(id =>
          variant?.variantOptionIds.includes(id as number)
        ) && variant.stock >= variant.minOrder
    );
  }, [selectedOptions, productVariants]);

  const displayPrice =
    matchedVariants.length === 1
      ? matchedVariants[0].price
      : Math.min(
          ...productVariants
            .filter(v => v.stock >= v.minOrder)
            .map(v => v.price)
        );

  const displayCompare =
    matchedVariants.length === 1
      ? matchedVariants[0].compareAtPrice
      : Math.max(
          ...productVariants
            .filter(v => v.stock >= v.minOrder)
            .map(v => v.compareAtPrice)
        );

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
            ) && v.stock >= v.minOrder
        );
        if (!valid) result.add(opt.id);
      });
    });
    return result;
  }, [selectedOptions, productVariants, variantOptions]);

  // --- update image when variant changes ---
  const [hasUserSelectedOptions, setHasUserSelectedOptions] =
    React.useState(false);
  const [lastMatchedVariantId, setLastMatchedVariantId] = React.useState<
    number | null
  >(null);

  // Track when user has made at least one selection
  React.useEffect(() => {
    const selectedCount = Object.values(selectedOptions).filter(Boolean).length;
    setHasUserSelectedOptions(selectedCount > 0);

    // Reset variant tracking when user deselects all options
    if (selectedCount === 0) {
      setLastMatchedVariantId(null);
    }
  }, [selectedOptions]);

  // Don't reset variant tracking when user interacts with carousel
  // This prevents unnecessary calls to onVariantImageChange

  // Only update image when user has selected options and there's exactly one matching variant
  // and it's not from carousel interaction and the variant actually changed
  React.useEffect(() => {
    console.log('Variant effect triggered:', {
      hasUserSelectedOptions,
      matchedVariantsLength: matchedVariants.length,
      hasImages: !!images,
      hasOnVariantImageChange: !!onVariantImageChange,
      isFromCarousel,
      currentVariantId: matchedVariants[0]?.id,
      lastMatchedVariantId,
      currentSelectedImageIndex,
    });

    if (
      hasUserSelectedOptions &&
      matchedVariants.length === 1 &&
      images &&
      onVariantImageChange &&
      !isFromCarousel
    ) {
      const currentVariantId = matchedVariants[0].id;
      const variantImage = matchedVariants[0].image;
      const imageIndex = images.findIndex(img => img === variantImage);

      // Only update if the variant actually changed (not due to carousel interaction)
      if (currentVariantId !== lastMatchedVariantId) {
        console.log(
          'Calling onVariantImageChange with index:',
          imageIndex,
          'current:',
          currentSelectedImageIndex
        );
        if (imageIndex !== -1) {
          onVariantImageChange(imageIndex);
          setLastMatchedVariantId(currentVariantId);
        }
      } else {
        console.log('Variant ID same, skipping update');
      }
    }
  }, [
    matchedVariants,
    images,
    onVariantImageChange,
    hasUserSelectedOptions,
    isFromCarousel,
    lastMatchedVariantId,
    currentSelectedImageIndex,
  ]);

  // --- update quantity when variant changes to respect minOrder ---
  React.useEffect(() => {
    if (matchedVariants.length === 1) {
      const minOrder = matchedVariants[0].minOrder;
      if (quantity < minOrder) {
        setQuantity(minOrder);
      }
    }
  }, [matchedVariants, quantity]);

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

      const matched = productVariants.find(
        v =>
          selectedIds.every(id => v?.variantOptionIds.includes(id as number)) &&
          v.stock >= v.minOrder
      );
      if (!matched) {
        toast.error(
          'The selected combination is currently unavailable or does not meet minimum order requirements.'
        );
        return;
      }

      if (quantity < matched.minOrder) {
        toast.error(
          `Minimum order quantity is ${matched.minOrder} for this product.`
        );
        return;
      }

      if (quantity > matched.stock) {
        toast.error(`Only ${matched.stock} item(s) left in stock.`);
        return;
      }

      // Build variant title from selected options
      const variantTitle = variantOptions
        .map(group => {
          const selectedOption = group.options.find(
            opt => opt.id === selectedOptions[group.id]
          );
          return selectedOption ? `${group.name}: ${selectedOption.value}` : '';
        })
        .filter(Boolean)
        .join(', ');

      console.log(matched, '{{{{}}}}}}');
      // Add to cart
      addItem({
        productId: id,
        productName: name,
        variantId: matched.id, // Use the variant ID from API response
        variantOptionIds: matched.variantOptionIds,
        variantTitle,
        quantity,
        price: matched.price,
        compareAtPrice: matched.compareAtPrice,
        image: matched.image,
        stock: matched.stock,
        minOrder: matched.minOrder,
      });

      toast.success('Added to cart successfully!');

      // Reset selections
      setSelectedOptions(
        Object.fromEntries(variantOptions.map(opt => [opt.id, null]))
      );
      setQuantity(1);
    } catch (e) {
      const error = e as Error;
      toast.error(error.message || 'Failed to add item to cart');
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-3 md:gap-4">
        <h2 className="text-xl font-bold capitalize md:text-xl lg:text-2xl">
          {name}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold md:text-xl lg:text-2xl">
            {' '}
            {formatDisplayCurrency(displayPrice)}
          </span>
          <span className="text-lg text-gray-500 line-through md:text-xl">
            {formatDisplayCurrency(displayCompare)}
          </span>
        </div>
        {isOutOfStock && (
          <div className="text-sm font-semibold text-red-600">Out of Stock</div>
        )}

        <ProductDetailDescription description={product?.description} />
      </div>

      {/* VARIANT OPTIONS */}
      {variantOptions.map(group => (
        <div key={group.id} className="space-y-4">
          <div className="text-base font-semibold md:text-lg">{group.name}</div>
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
                    'block rounded-full border-[2px] border-transparent px-6 py-2 text-sm font-semibold whitespace-nowrap !shadow-none transition-all duration-100 hover:cursor-pointer sm:px-5 sm:py-2 lg:px-6 lg:py-2 lg:text-base',
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
            className="h-8 w-8 rounded-none border-r border-gray-200 p-0 hover:bg-gray-50 [&:disabled_span]:!cursor-not-allowed"
            onClick={() => {
              const minOrder =
                matchedVariants.length === 1 ? matchedVariants[0].minOrder : 1;
              setQuantity(q => Math.max(minOrder, q - 1));
            }}
            disabled={
              quantity <=
              (matchedVariants.length === 1 ? matchedVariants[0].minOrder : 1)
            }
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
          className="btn-gradient--yellow size-10 flex-1 !text-lg !font-semibold hover:opacity-80"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          Add To Cart
        </Button>
      </div>
    </div>
  );
}
