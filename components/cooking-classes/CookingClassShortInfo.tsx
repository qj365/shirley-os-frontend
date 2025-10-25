import { GetCookingClassBySlugResponse } from '@/src/lib/api/customer';
import formatDisplayCurrency from '@/utils/helpers/formatDisplayCurrency';
import Image from 'next/image';

interface CookingClassShortInfoProps {
  cookingClass: GetCookingClassBySlugResponse;
}

export default function CookingClassShortInfo({
  cookingClass,
}: CookingClassShortInfoProps) {
  const hours = Math.floor(cookingClass.duration / 60);
  const minutes = cookingClass.duration % 60;

  const duration = `${hours} hours ${minutes ? `${minutes} minutes` : ''}`;

  return (
    <ul className="space-y-2 text-base md:space-y-2.5 md:text-lg [&_li]:flex [&_li]:items-center [&_li]:gap-2 [&_li]:font-medium">
      <li>
        <Image src="/svg/hourglass.svg" alt="icon" width={24} height={24} />
        <span>Duration: {duration}</span>
      </li>
      <li>
        <Image src="/svg/tag-price.svg" alt="icon" width={24} height={24} />
        <span>
          <strong>{formatDisplayCurrency(cookingClass.price)}</strong>
          &nbsp;per person
        </span>
      </li>
      <li>
        <Image src="/svg/location.svg" alt="icon" width={24} height={24} />
        <span>{cookingClass.address}</span>
      </li>
    </ul>
  );
}
