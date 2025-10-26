import CookingClassBookingFormGroup from '@/components/cooking-classes/CookingClassBookingFormGroup';
import CookingClassesHeroSection from '@/components/cooking-classes/CookingClassesHeroSection';
import CookingClassShortInfo from '@/components/cooking-classes/CookingClassShortInfo';
import { api } from '@/src/lib/api/customer';
import { notFound } from 'next/navigation';

async function fetchCookingClassBySlug(slug: string) {
  try {
    return await api.cookingClass.customerGetCookingClassBySlug({
      slug,
    });
  } catch (error) {
    console.error('Error fetching cooking class:', error);
    return null;
  }
}

export default async function CookingClassBooking({
  params,
}: {
  params: Promise<{ detail: string }>;
}) {
  const { detail: slug } = await params;
  const cookingClass = await fetchCookingClassBySlug(slug);

  if (!cookingClass) {
    notFound();
  }

  return (
    <>
      <CookingClassesHeroSection bgUrl={cookingClass.image} showOverLay />

      <section className="container py-7.5 md:py-10">
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-xl font-bold md:text-3xl">
              {cookingClass.name}
            </h1>
          </div>

          <CookingClassShortInfo cookingClass={cookingClass} />
        </div>
      </section>

      <section className="container py-7.5 md:py-10">
        <CookingClassBookingFormGroup cookingClass={cookingClass} />
      </section>
    </>
  );
}
