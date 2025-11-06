import CookingClassesHeroSection from '@/components/cooking-classes/CookingClassesHeroSection';
import CookingClassList from '@/components/cooking-classes/CookingClassList';
import OurRecipes from '@/components/landing/our-recipes';
import { api } from '@/src/lib/api/customer';
import { cn } from '@/lib/utils';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

async function fetchCookingClasses() {
  try {
    return await api.cookingClass.customerGetCookingClasses({
      pageSize: DEFAULT_PAGE_SIZE,
    });
  } catch (error) {
    console.error('Error fetching cooking classes:', error);
    return {
      data: [],
      nextCursor: undefined,
    };
  }
}

export default async function CookingClassesPage() {
  const cookingClassesData = await fetchCookingClasses();

  return (
    <>
      <CookingClassesHeroSection />
      <section className="bg-[#F8F8FA] py-7.5 md:py-[109px]">
        <h1
          className={cn(
            'mx-auto mb-5 max-w-[914px] text-center text-xl font-bold capitalize md:mb-8 md:text-4xl'
          )}
        >
          Immerse Yourself in West African Cuisine
        </h1>
        <p className="container mx-auto mb-7.5 max-w-[1321px] text-center text-base text-gray-700 capitalize sm:text-base md:mb-[109px] md:text-xl md:font-medium lg:text-2xl">
          Step into our Wood Green hub and embark on a culinary journey through
          West African Flavours. Shirley&apos;s cooking classes&apos;re an
          invitation to experience the traditions, techniques, and stories
          behind our beloved dishes.
        </p>

        <CookingClassList initData={cookingClassesData} />
      </section>
      <OurRecipes bgClassName="bg-white" />
    </>
  );
}
