'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import OrderListItem from '@/components/dashboard/OrderListItem';
import { FileText } from 'lucide-react';

// Mock data cho orders với nhiều status khác nhau
const mockOrdersHistory = [
  {
    id: '5951750',
    store: 'Maniam Super 1',
    amount: 485.55,
    status: 'Process',
  },
  {
    id: '5951750',
    store: 'Maniam Super Store',
    amount: 485.55,
    status: 'Process',
  },
  {
    id: '5951750',
    store: 'Maniam Super Store',
    amount: 485.55,
    status: 'Cancelled',
  },
  {
    id: '5951750',
    store: 'Maniam Super Store',
    amount: 485.55,
    status: 'Delivered',
  },
  {
    id: '5951750',
    store: 'Maniam Super Store',
    amount: 485.55,
    status: 'Cancelled',
  },
  {
    id: '5951750',
    store: 'Maniam Super Store',
    amount: 485.55,
    status: 'Delivered',
  },
  {
    id: '5951750',
    store: 'Maniam Super Store ',
    amount: 485.55,
    status: 'Delivered',
  },
  {
    id: '5951750',
    store: 'Maniam Super Store',
    amount: 485.55,
    status: 'Delivered',
  },
];

export default function OrdersHistory() {
  return (
    <DashboardLayout activePage="/my-page/order">
      {/* Page Title */}
      <h1 className="mt-4 mb-6 text-xl font-bold text-black md:text-3xl lg:mb-8">
        Order History
      </h1>

      {/* Orders List */}
      <div className="space-y-4">
        {mockOrdersHistory.map((order, index) => (
          <OrderListItem key={index} item={order} />
        ))}
      </div>

      {/* Empty state if no orders */}
      {mockOrdersHistory.length === 0 && (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white">
          <div className="text-center">
            <FileText className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-xl font-semibold text-gray-700">
              No orders yet
            </h3>
            <p className="mt-2 text-gray-500">
              Your order history will appear here
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
