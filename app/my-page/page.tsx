'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Image from 'next/image';

export default function MyPage() {
  // Hero Banner Component
  const HeroBanner = ({
    showRenewalDate = false,
  }: {
    showRenewalDate?: boolean;
  }) => (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#F3C03F] to-[#FABC20] p-6 md:p-8">
      <div className="relative z-10 max-w-[250px] md:max-w-[533px]">
        <h1 className="mb-2 text-2xl font-bold text-black md:text-3xl lg:text-4xl">
          <span className="md:hidden">
            Premium West African Flavours for Your{' '}
            <span className="text-[#C41E3A]">Business</span>
          </span>
          <span className="hidden md:block">
            Premium West African <br /> Flavours for Your{' '}
            <span className="text-[#C41E3A]">Business</span>
          </span>
        </h1>
        {showRenewalDate && (
          <p className="mt-4 max-w-[250px] text-sm font-semibold text-white md:text-base">
            Your subscription will renew on:
            <br />
            27th March 2025
          </p>
        )}
      </div>
      <div className="absolute right-[-80px] bottom-0 h-full w-80 md:right-0 md:w-1/2">
        <Image
          src="/image/girl.png"
          alt="Happy woman"
          fill
          className="object-contain object-bottom"
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>
    </div>
  );

  // Orders Section
  // const OrdersSection = () => (
  //   <div className="space-y-4">
  //     <h2 className="mb-4 text-xl font-bold text-black md:text-2xl">
  //       In progress Orders
  //     </h2>
  //     {mockOrders.map((order, index) => (
  //       <OrderListItem key={index} item={order} />
  //     ))}
  //   </div>
  // );

  // Subscription Section
  const SubscriptionSection = () => (
    <div className="rounded-2xl bg-[#FFEDC3] p-6 md:p-8">
      <h2 className="mb-4 text-2xl font-bold text-black md:text-3xl">
        Your Subscription
      </h2>
      <p className="text-base leading-relaxed text-gray-700 md:text-lg">
        Within your subscriptions you can easily edit your flavours, change the
        delivery date, pause or even cancel your subscription.
      </p>
    </div>
  );

  return (
    <DashboardLayout activePage="/my-page">
      <div className="space-y-6">
        {/* Hero Banner */}
        <HeroBanner showRenewalDate={true} />

        {/* In Progress Orders Section */}
        {/* <OrdersSection /> */}

        {/* Subscription Section */}
        <SubscriptionSection />
      </div>
    </DashboardLayout>
  );
}
