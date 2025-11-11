'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { GetProductBySlugResponse } from '@/src/lib/api/customer';
import formatDisplayCurrency from '@/utils/helpers/formatDisplayCurrency';
import { Minus, Plus } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import ProductDetailDescription from './ProductDetailDescription';
import {
  CartPaymentPlan,
  SUBSCRIPTION_FREQUENCIES,
  SubscriptionFrequency,
  useCartStore,
} from '@/stores/cart-store';
import { Switch } from '../ui/switch';

type Props = {
  product: GetProductBySlugResponse;
  onVariantImageChange?: (imageIndex: number) => void;
  isFromCarousel?: boolean;
  currentSelectedImageIndex?: number;
};

const SUBSCRIPTION_FEATURES = [
  'Lowest price option',
  '10% off all recurring orders',
  'Easily swap & skip deliveries',
  'Cancel quickly anytime',
];

export default function ProductDetailMainInfo({
  product,
  onVariantImageChange,
  isFromCarousel = false,
  currentSelectedImageIndex = 0,
}: Props) {
  const { name, productVariants, variantOptions, images, id } = product || {};
  const addItem = useCartStore(state => state.addItem);

  const isOutOfStock = productVariants?.every(item => item.stock < 1);

  // --- state ---
  const [selectedOptions, setSelectedOptions] = React.useState<
    Record<number, number | null>
  >(() => Object.fromEntries(variantOptions.map(opt => [opt.id, null])));
  const [quantity, setQuantity] = React.useState(1);
  const [paymentPlan, setPaymentPlan] =
    React.useState<CartPaymentPlan>('one_time');
  const [deliveryFrequency, setDeliveryFrequency] =
    React.useState<SubscriptionFrequency>(SUBSCRIPTION_FREQUENCIES[1]);

  const safeProductVariants = React.useMemo(
    () => (productVariants ?? []).filter(variant => variant.stock >= 1),
    [productVariants]
  );

  const isSubscription = paymentPlan === 'subscription';

  const matchedVariants = React.useMemo(() => {
    const selectedIds = Object.values(selectedOptions).filter(Boolean);
    if (selectedIds.length === 0) return safeProductVariants;

    return safeProductVariants.filter(
      variant =>
        selectedIds.every(id =>
          variant?.variantOptionIds.includes(id as number)
        ) && variant.stock >= 1
    );
  }, [selectedOptions, safeProductVariants]);

  const displayPrice =
    matchedVariants.length === 1
      ? matchedVariants[0].price
      : safeProductVariants.length > 0
        ? Math.min(...safeProductVariants.map(v => v.price))
        : 0;

  const displayCompare =
    matchedVariants.length === 1
      ? matchedVariants[0].compareAtPrice
      : safeProductVariants.length > 0
        ? Math.max(...safeProductVariants.map(v => v.compareAtPrice))
        : 0;

  const selectedVariant =
    matchedVariants.length === 1 ? matchedVariants[0] : null;

  const unitPrice =
    selectedVariant?.price ??
    (Number.isFinite(displayPrice) ? displayPrice : 0);
  const oneTimeTotal = unitPrice * quantity;
  const subscriptionTotal = oneTimeTotal * 0.9;

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
        const valid = safeProductVariants.some(
          v =>
            selectedIds.every(id =>
              v?.variantOptionIds.includes(id as number)
            ) && v.stock >= 1
        );
        if (!valid) result.add(opt.id);
      });
    });
    return result;
  }, [selectedOptions, safeProductVariants, variantOptions]);

  // --- auto-select options when there is exactly one variant (run once per product) ---
  const lastAutoSelectProductIdRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!productVariants || !variantOptions) return;
    if (id == null) return;

    // ensure this logic runs at most once per product change
    if (lastAutoSelectProductIdRef.current === id) return;
    lastAutoSelectProductIdRef.current = id;

    if (productVariants.length !== 1) return;

    const singleVariant = productVariants[0];

    // Only run when variant has enough stock (minimum 1)
    if (singleVariant.stock < 1) return;

    const hasAnySelection = Object.values(selectedOptions).some(Boolean);
    if (hasAnySelection) return; // don't override user selection

    const nextSelection = Object.fromEntries(
      variantOptions.map(group => {
        const matchedOpt = group.options.find(opt =>
          singleVariant.variantOptionIds.includes(opt.id)
        );
        return [group.id, matchedOpt ? matchedOpt.id : null];
      })
    );

    setSelectedOptions(nextSelection);
  }, [id, productVariants, variantOptions, selectedOptions]);

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
        if (imageIndex !== -1) {
          onVariantImageChange(imageIndex);
          setLastMatchedVariantId(currentVariantId);
        }
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

  // --- update quantity when variant changes (default minOrder is 1) ---
  React.useEffect(() => {
    if (matchedVariants.length === 1) {
      const minOrder = 1;
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

      const matched = safeProductVariants.find(
        v =>
          selectedIds.every(id => v?.variantOptionIds.includes(id as number)) &&
          v.stock >= 1
      );
      if (!matched) {
        toast.error('The selected combination is currently unavailable.');
        return;
      }

      const minOrder = 1;
      if (quantity < minOrder) {
        toast.error(`Minimum order quantity is ${minOrder} for this product.`);
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
        minOrder: 1,
        categoryName: product.category?.name || '',
        paymentPlan,
        deliveryFrequencyWeeks: isSubscription ? deliveryFrequency : null,
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

      <div className="mt-4 flex flex-col gap-8 sm:flex-row md:items-center md:gap-3">
        <div className="flex min-w-[160px] items-center rounded-md border border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-none border-r border-gray-200 p-0 hover:bg-gray-50 [&:disabled_span]:!cursor-not-allowed"
            onClick={() => {
              const minOrder = 1;
              setQuantity(q => Math.max(minOrder, q - 1));
            }}
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

      <div className="flex flex-col gap-4">
        <div
          className={cn(
            !isSubscription ? 'bg-[#FFF3D6]' : 'bg-[#F2F2F2]',
            'rounded-xl p-4'
          )}
        >
          <div className="flex items-center gap-2">
            <Switch
              checked={!isSubscription}
              onCheckedChange={() => setPaymentPlan('one_time')}
            />
            <div className="flex flex-col gap-1">
              <p className="text-lg font-semibold min-md:text-xl">One-Time</p>
              <span className="text-base font-semibold">
                {formatDisplayCurrency(oneTimeTotal)}
              </span>
            </div>
          </div>
        </div>

        <div
          className={cn(
            isSubscription ? 'bg-[#FFF3D6]' : 'bg-[#F2F2F2]',
            'space-y-4 rounded-xl p-4'
          )}
        >
          <div className="flex items-center gap-2">
            <Switch
              checked={isSubscription}
              onCheckedChange={() => setPaymentPlan('subscription')}
            />
            <div className="flex flex-col gap-1">
              <p className="text-lg font-semibold min-md:text-xl">
                Subscribe &amp; Save 10%
              </p>
              <span className="text-base font-semibold">
                {formatDisplayCurrency(subscriptionTotal)}{' '}
                <span className="text-sm text-gray-500 line-through">
                  {' '}
                  {formatDisplayCurrency(oneTimeTotal)}
                </span>
              </span>
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold">How subscription work:</p>
            <ul>
              {SUBSCRIPTION_FEATURES.map(feature => (
                <li key={feature} className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/image/subscription_checked.png`}
                    alt={feature}
                    className={cn(
                      'h-4 w-6 object-contain',
                      isSubscription ? 'opacity-100' : 'opacity-50'
                    )}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div
            className={cn(
              'space-y-0.5',
              !isSubscription && 'pointer-events-none opacity-50'
            )}
          >
            <Label className="text-sm font-semibold text-gray-700">
              Deliver every
            </Label>
            <Select
              value={String(deliveryFrequency)}
              onValueChange={value =>
                setDeliveryFrequency(Number(value) as SubscriptionFrequency)
              }
            >
              <SelectTrigger className="h-11 rounded-xl border-none bg-white text-sm font-medium shadow-none !ring-0 !ring-offset-0">
                <SelectValue placeholder="Choose frequency" />
              </SelectTrigger>
              <SelectContent className="border-none bg-white shadow-md">
                {SUBSCRIPTION_FREQUENCIES.map(weeks => (
                  <SelectItem
                    key={weeks}
                    value={String(weeks)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    Every {weeks} week{weeks > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
