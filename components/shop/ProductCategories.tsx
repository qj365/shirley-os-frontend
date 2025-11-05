'use client';

import { cn } from '@/lib/utils';
import { GetCategoriesResponse } from '@/src/lib/api/customer';
import { useSearchParams } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { MAX_VISIBLE_PRODUCT_CATEGORIES } from '@/utils/constants';

export default function ProductCategories({
  categories,
  selectedCategoryId,
  onCategorySelect,
}: {
  categories: GetCategoriesResponse[];
  selectedCategoryId?: string;
  onCategorySelect?: (categoryId: string | undefined) => void;
}) {
  const searchParams = useSearchParams();
  const visible = categories.slice(0, MAX_VISIBLE_PRODUCT_CATEGORIES);
  const hidden = categories.slice(MAX_VISIBLE_PRODUCT_CATEGORIES);

  // Build URL with category query parameter
  const buildCategoryUrl = (categoryId: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    const queryString = params.toString();
    return `/shop${queryString ? `?${queryString}` : ''}`;
  };

  // Handle category click - client-side only, no URL navigation
  const handleCategoryClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    categoryId: string | undefined
  ) => {
    e.preventDefault();

    // Update URL silently using pushState (for shareable URLs) but don't trigger navigation
    // This allows URLs to be shareable but prevents scroll issues
    const url = buildCategoryUrl(categoryId);
    window.history.pushState({ category: categoryId }, '', url);

    // Notify parent component to handle the category change client-side
    // This will NOT trigger SSR re-render, so no scroll issue
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  return (
    <ul className="mb-12 flex flex-wrap gap-3 sm:mb-16 sm:gap-4">
      {[
        {
          name: 'All',
          id: undefined,
        },
        ...visible,
      ].map((category, index) => {
        const isSelected = selectedCategoryId == category.id?.toString();
        return (
          <button
            key={index}
            onClick={e => handleCategoryClick(e, category.id?.toString())}
            className={`${
              isSelected
                ? 'btn-gradient--yellow'
                : 'text-opacity-90 hover:text-opacity-100 bg-[#E4E4E4] text-black hover:bg-gradient-to-r hover:from-[#F3C03F] hover:to-[#FFBA0A] hover:text-black'
            } block rounded-full border-[2px] border-transparent px-6 py-2 text-base font-semibold whitespace-nowrap !shadow-none transition-all duration-300 hover:cursor-pointer sm:px-5 sm:py-2 sm:text-sm lg:px-6 lg:py-2 lg:text-base xl:text-lg`}
          >
            {category.name}
          </button>
        );
      })}

      {hidden.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-opacity-90 hover:text-opacity-100 block rounded-full bg-[#E4E4E4] px-6 py-2 text-base font-semibold whitespace-nowrap text-black transition-all duration-300 hover:cursor-pointer hover:bg-gradient-to-r hover:from-[#F3C03F] hover:to-[#FFBA0A] hover:text-black sm:px-5 sm:py-2 sm:text-sm lg:px-6 lg:py-2 lg:text-base xl:text-lg">
              +{hidden.length} more
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="border-none bg-white shadow"
          >
            {hidden.map(cat => {
              const isSelected = selectedCategoryId == cat?.id.toString();
              return (
                <DropdownMenuItem key={cat.id}>
                  <button
                    onClick={e => handleCategoryClick(e, cat.id.toString())}
                    className={cn(
                      isSelected && '!text-[#FFBA0A]',
                      'inline-block w-full text-left text-sm font-semibold text-black hover:cursor-pointer hover:text-[#FFBA0A] lg:text-base xl:text-lg'
                    )}
                  >
                    {cat.name}
                  </button>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </ul>
  );
}
