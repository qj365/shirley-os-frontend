import { cn } from '@/lib/utils';
import { GetCategoriesResponse } from '@/src/lib/api/customer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function ProductCategories({
  categories,
  selectedCategoryId,
  onCategorySelect,
}: {
  categories: GetCategoriesResponse[];
  selectedCategoryId?: string;
  onCategorySelect: (categoryId: string | undefined) => void;
}) {
  const MAX_VISIBLE = 6;
  const visible = categories.slice(0, MAX_VISIBLE);
  const hidden = categories.slice(MAX_VISIBLE);

  const handleCategoryClick = (categoryId: string | undefined) => {
    onCategorySelect(categoryId);
  };

  return (
    <ul className="mb-12 flex flex-wrap gap-3 sm:mb-16 sm:gap-4">
      {[
        {
          name: 'All',
          id: undefined,
        },
        ...visible,
      ].map((category, index) => (
        <button
          key={index}
          onClick={() => handleCategoryClick(category.id?.toString())}
          className={`${
            selectedCategoryId == category.id?.toString()
              ? 'btn-gradient--yellow'
              : 'text-opacity-90 hover:text-opacity-100 bg-[#E4E4E4] text-black hover:bg-gradient-to-r hover:from-[#F3C03F] hover:to-[#FFBA0A] hover:text-black'
          } block rounded-full border-[2px] border-transparent px-6 py-2 text-base font-semibold whitespace-nowrap !shadow-none transition-all duration-300 hover:cursor-pointer sm:px-5 sm:py-2 sm:text-sm lg:px-6 lg:py-2 lg:text-base xl:text-lg`}
        >
          {category.name}
        </button>
      ))}

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
            {hidden.map(cat => (
              <DropdownMenuItem key={cat.id}>
                <button
                  onClick={() => handleCategoryClick(cat.id.toString())}
                  className={cn(
                    selectedCategoryId == cat?.id.toString() &&
                      '!text-[#FFBA0A]',
                    'inline-block w-full text-left text-sm font-semibold text-black hover:cursor-pointer hover:text-[#FFBA0A] lg:text-base xl:text-lg'
                  )}
                >
                  {cat.name}
                </button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </ul>
  );
}
