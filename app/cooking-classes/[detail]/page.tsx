import BookingButton from '@/components/cooking-classes/BookingButton';
import CookingClassDetailMainInfo from '@/components/cooking-classes/CookingClassDetailMainInfo';
import RecipeTestimonial from '@/components/recipe/recipe-testimonial';
import { cn } from '@/lib/utils';
import { headers } from 'next/headers';

export default async function CookingClassDetail() {
  const headersList = await headers();

  const pathname = headersList.get('x-url-pathname');

  const btnClass = cn(
    'btn-gradient--yellow mx-auto flex w-full max-w-[565px] items-center justify-center px-6 py-2.5 hover:opacity-80 active:scale-95 xl:px-8 text-base font-semibold capitalize 2xl:text-xl'
  );

  return (
    <>
      <section className="px-6 pt-20 md:pt-[155px]">
        <div
          className="mx-auto h-[235px] max-w-[1530px] rounded-[10px] bg-cover bg-center sm:h-[400px] md:h-[500px] md:rounded-[20px] lg:h-[600px] xl:h-[703px]"
          style={{
            backgroundImage: `url('/image/cooking_class_detail_hero_img.png')`,
          }}
        />
      </section>

      <section className="container py-7.5 md:py-10">
        <CookingClassDetailMainInfo />

        <BookingButton
          className={cn(btnClass, 'my-10 md:my-17.5')}
          label="Book now"
          navigateLink={`${pathname}/booking`}
        />

        <div className="mb-12.5 rounded-[10px] bg-[#FFEDC3] p-[20px]">
          <h2 className="mb-2.5 text-lg font-bold md:text-3xl">
            What to Expect
          </h2>
          <p className="text-sm leading-5 md:text-xl md:leading-14">
            Welcome drink on arrival Introduction to West African ingredients
            and spices Demonstration by our Chef Hands-on cooking of perfect
            Jollof rice Learn about regional variations and techniques Enjoy
            your creation with fellow participants Take home a jar of
            Shirley&apos;s Jollof Paste
          </p>
        </div>
        <div>
          <h2 className="mb-2.5 text-lg font-bold md:text-3xl">Note</h2>
          <p className="text-sm leading-5 md:text-xl md:leading-14">
            Registration opens 15 minutes before the class starts. Dietary
            requirements can be catered for if known in advance. Please
            familiarise yourself with our cancellation policy prior to booking.
            All equipment and ingredients provided.
          </p>
        </div>
      </section>
      <div className="pt-[40px]">
        <RecipeTestimonial />
      </div>
      <section className="container flex flex-col gap-[20px] py-[50px] md:gap-[35px] md:py-[150px]">
        <h2 className="text-center text-lg font-bold md:text-3xl">
          Private Bookings
        </h2>
        <p className="text-center text-sm leading-5 md:text-xl md:leading-14">
          Looking for a bespoke experience? We offer private classes for special
          occasions and corporate events.
        </p>
        <button className={btnClass}>enquiry now</button>
      </section>
    </>
  );
}
