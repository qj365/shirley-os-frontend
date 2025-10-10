import CookingClassBookingFormGroup from '@/components/cooking-classes/CookingClassBookingFormGroup';
import CookingClassDetailMainInfo from '@/components/cooking-classes/CookingClassDetailMainInfo';
import CookingClassesHeroSection from '@/components/cooking-classes/CookingClassesHeroSection';

export default function CookingClassBooking() {
  return (
    <>
      <CookingClassesHeroSection bgUrl="/image/cooking_class_detail_hero_img.png" showOverLay />
      <section className="container py-7.5">
        <CookingClassDetailMainInfo />
      </section>
      <CookingClassBookingFormGroup />
    </>
  );
}

// const registerClassSchema = z.object({
//   numberOfPeople: z.string().nonempty('This field is required'),
//   fullName: z.string().trim().nonempty('This field is required'),
//   email: z.email('Email invalid').nonempty('This field is required'),
//   phone: z.string().trim().nonempty('This field is required'),
//   bookingFor: z.string().nonempty('This field is required'),
//   specialRequest: z.string().nonempty('This field is required'),
//   holderName: z.string().trim().nonempty('This field is required'),
//   cardNumber: z.string().regex(/^\d{16}$/, 'Card Number invalid'),
//   expire: z.string().regex(/^\d{2}\/\d{2}$/, 'Expire date invalid'),
//   cvv: z.string().regex(/^\d{3,4}$/, 'CVV invalid'),
//   region: z.string().nonempty('This field is required'),
//   voucherCode: z.string(),
// });
