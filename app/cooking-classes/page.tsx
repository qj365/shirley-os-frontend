import CookingClassesHeroSection from '@/components/cooking-classes/CookingClassesHeroSection';
import CookingClassListItem from '@/components/cooking-classes/CookingClassListItem';
import OurRecipes from '@/components/landing/our-recipes';
import { fillArrayWithNumber } from '@/utils/helpers/fillArrayWithNumber';

export default function CookingClassesPage() {
  return (
    <>
      <CookingClassesHeroSection />
      <section className="bg-[#F8F8FA] py-7.5 md:py-[109px]">
        <h1 className="container mx-auto mb-5 max-w-[914px] text-center text-[23px] font-bold capitalize md:mb-8 md:text-[51px]">
          Immerse Yourself in West African Cuisine
        </h1>
        <p className="container mx-auto mb-7.5 max-w-[1321px] text-center text-[14px] font-normal text-gray-700 capitalize md:mb-[109px] md:text-[30px] md:font-medium">
          Step into our Wood Green hub and embark on a culinary journey through West African
          Flavours. Shirley&apos;s cooking classes&apos;re an invitation to experience the
          traditions, techniques, and stories behind our beloved dishes.
        </p>

        <div className="container grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:gap-7">
          {fillArrayWithNumber(8).map(item => (
            <CookingClassListItem
              key={item}
              description={
                item % 2 === 0
                  ? "Discover the secrets behind West Africa's most celebrated rice dish and learn how to create authentic Jollof perfection."
                  : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
              }
              imageSrc={'/image/whRecipe6.jpg'}
              price={item % 2 === 0 ? '85' : ''}
              slug={`class-${item + 1}`}
              title={`Jollof Master Class ${item + 1}`}
            />
          ))}
        </div>
      </section>
      <OurRecipes bgClassName="bg-white" />
    </>
  );
}
