import Image from 'next/image';

export default function CookingClassDetailMainInfo() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold md:text-3xl">Cooking Chronicles</h1>

      <ul className="space-y-2 text-base md:space-y-2.5 md:text-lg [&_li]:flex [&_li]:items-center [&_li]:gap-2 [&_li]:font-medium">
        <li>
          <Image src="/svg/clock.svg" alt="icon" width={24} height={24} />
          <span>22 April 2025&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11:00 am</span>
        </li>
        <li>
          <Image src="/svg/tag-price.svg" alt="icon" width={24} height={24} />
          <span>
            <strong>£65</strong>&nbsp;per person
          </span>
        </li>
        <li>
          <Image src="/svg/location.svg" alt="icon" width={24} height={24} />
          <span>
            Shirley&apos;s Cultural Hub 123 Green Lane Wood Green London N22 7XX
          </span>
        </li>
      </ul>
    </div>
  );
}
