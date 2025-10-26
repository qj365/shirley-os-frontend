import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import BookingButton from './BookingButton';
import formatDisplayCurrency from '@/utils/helpers/formatDisplayCurrency';

type Props = {
  imageSrc: string;
  slug: string;
  title: string;
  description: string;
  price: number;
};

export default function CookingClassListItem({
  imageSrc,
  slug,
  description,
  price,
  title,
}: Props) {
  return (
    <Link
      className="shadow-card flex flex-col hover:cursor-pointer"
      href={`/cooking-class/${slug}`}
    >
      <figure className="relative m-0 h-[227px] w-full shrink-0 overflow-hidden lg:h-[350px]">
        <Image
          src={imageSrc}
          alt="Cooking class image"
          fill
          className="h-full w-full object-cover transition-transform duration-300"
        />
      </figure>
      <div className="flex flex-1 flex-col gap-2 p-4 2xl:gap-4">
        <h3 className="text-base font-bold md:text-xl">{title}</h3>

        <p
          className="mb-auto line-clamp-3 text-sm text-ellipsis text-gray-700 md:text-base"
          dangerouslySetInnerHTML={{ __html: description || '' }}
        />
        <div className="flex flex-wrap items-end justify-between gap-2">
          <p className="text-sm md:text-base">
            <strong className="text-lg md:text-xl">
              {formatDisplayCurrency(price)}
            </strong>{' '}
            <i>per person </i>
          </p>
          <BookingButton
            className="btn-gradient--yellow block px-6 py-2 font-semibold hover:opacity-80 active:scale-95 xl:px-8"
            label="Book now"
            navigateLink={`/cooking-class/${slug}/booking`}
          />
        </div>
      </div>
    </Link>
  );
}
