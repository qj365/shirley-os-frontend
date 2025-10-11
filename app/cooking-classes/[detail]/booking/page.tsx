import CookingClassBookingFormGroup from '@/components/cooking-classes/CookingClassBookingFormGroup';
import CookingClassDetailMainInfo from '@/components/cooking-classes/CookingClassDetailMainInfo';
import CookingClassesHeroSection from '@/components/cooking-classes/CookingClassesHeroSection';

export default function CookingClassBooking() {
  return (
    <>
      <CookingClassesHeroSection
        bgUrl="/image/cooking_class_detail_hero_img.png"
        showOverLay
      />
      <section className="container py-7.5 md:py-10">
        <CookingClassDetailMainInfo />
      </section>
      <CookingClassBookingFormGroup />
    </>
  );
}
