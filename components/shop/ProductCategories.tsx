import { GetCategoriesResponse } from '@/src/lib/api/customer';
import Link from 'next/link';

export default function ProductCategories({
  categories,
  selectedCategoryId,
}: {
  categories: GetCategoriesResponse[];
  selectedCategoryId?: string;
}) {
  // const MAX_VISIBLE = 1;
  // const visible = categories.slice(0, MAX_VISIBLE);
  // const hidden = categories.slice(MAX_VISIBLE);

  // const handleSelect = (id: string) => {
  //   const params = new URLSearchParams(searchParams);
  //   if (id) {
  //     params.set('categoryId', id);
  //   } else {
  //     params.delete('categoryId');
  //   }

  //   router.push(`?${params.toString()}`);
  // };

  return (
    <ul className="mb-12 flex flex-wrap gap-3 sm:mb-16 sm:gap-4">
      {[
        {
          name: 'All',
          id: undefined,
        },
        ...categories,
      ].map((category, index) => (
        <Link
          href={index === 0 ? '/shop' : `/shop?categoryId=${category.id}`}
          key={index}
          className={`${
            selectedCategoryId == category.id
              ? 'btn-gradient--yellow'
              : 'text-opacity-90 hover:text-opacity-100 bg-[#E4E4E4] text-black hover:bg-gradient-to-r hover:from-[#F3C03F] hover:to-[#FFBA0A] hover:text-black'
          } block rounded-full border-[2px] border-transparent px-6 py-2 text-base font-semibold whitespace-nowrap !shadow-none transition-all duration-300 hover:cursor-pointer sm:px-5 sm:py-2 sm:text-sm lg:px-6 lg:py-2 lg:text-base xl:text-lg`}
          scroll={index === 0 ? true : false}
        >
          {category.name}
        </Link>
      ))}

      {/* {hidden.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-opacity-90 hover:text-opacity-100 block rounded-full bg-[#E4E4E4] px-6 py-2 text-base font-semibold whitespace-nowrap text-black transition-all duration-300 hover:cursor-pointer hover:bg-gradient-to-r hover:from-[#F3C03F] hover:to-[#FFBA0A] hover:text-black sm:px-5 sm:py-2 sm:text-sm lg:px-6 lg:py-2 lg:text-base xl:text-lg">
              +{hidden.length} more
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="border-none shadow">
            {hidden.map(cat => (
              <DropdownMenuItem key={cat.id}>
                <p
                  className={cn(
                    Number(selectedCategoryId) == cat?.id && 'text-[#FFBA0A]',
                    'inline-block w-full text-sm font-semibold text-black hover:cursor-pointer hover:text-[#FFBA0A] lg:text-base xl:text-lg'
                  )}
                  onClick={() => handleSelect(cat?.id.toString())}
                >
                  {cat.name}
                </p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )} */}
    </ul>
  );
}
