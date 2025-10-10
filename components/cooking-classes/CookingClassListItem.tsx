import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import BookingButton from './BookingButton';

type Props = {
  imageSrc: string;
  slug: string;
  title: string;
  description: string;
  price: string;
};

export default function CookingClassListItem({ imageSrc, slug, description, price, title }: Props) {
  return (
    <Link
      className="shadow-card flex flex-col hover:cursor-pointer"
      href={`/cooking-classes/${slug}`}
    >
      <figure className="relative m-0 h-[227px] w-full shrink-0 overflow-hidden lg:h-[350px] 2xl:h-[400px]">
        <Image
          src={imageSrc}
          alt="Cooking class image"
          fill
          className="h-full w-full object-cover transition-transform duration-300"
        />
      </figure>
      <div className="flex flex-1 flex-col gap-2 p-4 2xl:gap-4 2xl:p-7">
        <h3 className="text-xl font-bold md:text-2xl">{title}</h3>
        <p
          className="mb-auto line-clamp-3 text-base text-ellipsis text-gray-700 md:text-lg"
          title={description}
        >
          {description}
        </p>
        <div className="flex flex-wrap items-end justify-between">
          <p className="text-sm md:text-base">
            {price ? (
              <>
                <strong className="text-xl md:text-2xl">£{price}</strong> <i>each person </i>
              </>
            ) : (
              <i>Prize on enquiry </i>
            )}
          </p>
          <BookingButton
            className="btn-gradient--yellow block px-6 py-2.5 font-semibold hover:opacity-80 active:scale-95 xl:px-8"
            label="Book now"
            navigateLink={`/cooking-classes/${slug}/booking`}
          />
        </div>
      </div>
    </Link>
  );
}
