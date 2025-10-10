'use client';
import { useRouter } from 'next/navigation';

type Props = {
  className: string;
  label: string;
  navigateLink: string;
};
export default function BookingButton({ className, label, navigateLink }: Props) {
  const router = useRouter();

  return (
    <button
      className={className}
      type="button"
      onClick={event => {
        event.preventDefault();
        event.stopPropagation();
        router.push(navigateLink);
      }}
    >
      {label}
    </button>
  );
}
