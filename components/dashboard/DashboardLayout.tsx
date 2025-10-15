'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Bell, FileText, LayoutDashboard, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

// Sidebar menu items
export const dashboardMenuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/my-page',
  },
  // {
  //   icon: Truck,
  //   label: 'Upcoming deliveries',
  //   href: '#',
  // },
  {
    icon: FileText,
    label: 'Orders history',
    href: '/my-page/order',
  },
  // {
  //   icon: RefreshCw,
  //   label: 'Subscription',
  //   href: '#',
  // },
  // {
  //   icon: HelpCircle,
  //   label: 'Support',
  //   href: '#',
  // },
];

interface DashboardLayoutProps {
  children: ReactNode;
  activePage: string;
}

export default function DashboardLayout({
  children,
  activePage,
}: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sidebar Component
  const Sidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      className={`${isMobile ? 'w-full' : 'w-60'} flex h-full flex-col bg-gray-100`}
    >
      <div className="px-3 py-6">
        <div className="mb-8 flex items-center justify-center lg:hidden">
          <Link
            href="/"
            className="flex h-[28px] w-[150px] items-center justify-center"
          >
            <Image
              src="/image/Logo_Charcoal_Black.png"
              alt="Shirley's Logo"
              width={210}
              height={47}
              className="h-full w-full object-contain"
            />
          </Link>
        </div>

        {dashboardMenuItems.map((item, index) => {
          const isActive =
            item.href === activePage ||
            (activePage.includes(item.label.toLowerCase()) &&
              item.label !== 'Dashboard');

          return (
            <a
              key={index}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                isActive
                  ? 'bg-[#F3C03F] font-semibold text-black'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => {
                if (isMobile) setIsMobileMenuOpen(false);
              }}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm">{item.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Header */}
      <header className="sticky top-0 z-30 hidden border-b border-gray-200 bg-white lg:block">
        <div className="mx-auto max-w-[1600px] px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-12">
              <Link
                href="/"
                className="flex h-[34px] w-[150px] items-center justify-center sm:h-[38px] sm:w-[170px]"
              >
                <Image
                  src="/image/Logo_Charcoal_Black.png"
                  alt="Shirley's Logo"
                  width={210}
                  height={47}
                  className="h-full w-full object-contain"
                />
              </Link>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <button className="rounded-full p-2 transition-colors hover:bg-gray-100">
                <Bell className="h-6 w-6 text-gray-700" />
              </button>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3C03F]">
                <span className="text-lg font-bold text-black">TM</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white lg:hidden">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="rounded-lg p-2 transition-colors hover:bg-gray-100">
                  <Menu className="h-6 w-6 text-gray-700" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 p-0"
                showCloseButton={false}
              >
                <Sidebar isMobile={true} />
              </SheetContent>
            </Sheet>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              <button className="rounded-full p-2 transition-colors hover:bg-gray-100">
                <Bell className="h-6 w-6 text-gray-700" />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3C03F]">
                <span className="text-base font-bold text-black">TM</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="sticky top-[73px] hidden h-[calc(100vh-73px)] lg:block">
          <Sidebar />
        </aside>

        {/* Main Content Area */}
        <main className="max-w-[1400px] flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
