import BookingButton from '@/components/cooking-classes/BookingButton';
import CookingClassShortInfo from '@/components/cooking-classes/CookingClassShortInfo';
import RecipeTestimonial from '@/components/recipe/recipe-testimonial';
import RichContent from '@/components/shared/RichContent';
import { cn } from '@/lib/utils';
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

export default async function CookingClassDetail({
  params,
}: {
  params: Promise<{ detail: string }>;
}) {
  const { detail: slug } = await params;
  const cookingClass = await fetchCookingClassBySlug(slug);

  if (!cookingClass) {
    notFound();
  }

  const btnClass = cn(
    'btn-gradient--yellow mx-auto flex w-full max-w-[565px] items-center justify-center px-6 py-2.5 hover:opacity-80 active:scale-95 xl:px-8 text-base font-semibold capitalize 2xl:text-lg'
  );

  return (
    <>
      <section className="px-6 pt-20 md:pt-[100px]">
        <div
          className="mx-auto h-[235px] max-w-[1530px] rounded-[10px] bg-cover bg-center sm:h-[400px] md:h-[500px] md:rounded-[20px] lg:h-[600px] xl:h-[703px]"
          style={{
            backgroundImage: `url('${cookingClass.image}')`,
          }}
        />
      </section>

      <section className="container py-7.5 md:py-10">
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-xl font-bold md:text-3xl">
              {cookingClass.name}
            </h1>
            <RichContent
              content={cookingClass?.description || ''}
              className="leading-relaxed font-medium"
            />
          </div>
          {/* What to expect section */}
          <div className="rounded-[10px] bg-[#FFEDC3] p-[20px]">
            <h3 className="mb-2.5 text-lg font-semibold md:text-xl">
              What to Expect
            </h3>
            <RichContent
              content={cookingClass?.whatToExpect || ''}
              className="leading-relaxed"
            />
          </div>

          <CookingClassShortInfo cookingClass={cookingClass} />

          <BookingButton
            className={cn(btnClass, 'my-4 md:my-10')}
            label="Book now"
            navigateLink={`/cooking-class/${slug}/booking`}
          />
        </div>
      </section>

      <RecipeTestimonial />
    </>
  );
}
