import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type OrderStatus = 'Process' | 'Cancelled' | 'Delivered' | 'Pending';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

// Get button style based on status
export const getStatusStyle = (status: OrderStatus) => {
  switch (status) {
    case 'Process':
      return 'bg-[#22C55E] hover:bg-[#16A34A] text-white';
    case 'Cancelled':
      return 'bg-[#DC2626] hover:bg-[#B91C1C] text-white';
    case 'Delivered':
      return 'bg-[#F3C03F] hover:bg-[#E5B338] text-black';
    case 'Pending':
      return 'bg-gray-500 hover:bg-gray-600 text-white';
    default:
      return 'bg-gray-500 hover:bg-gray-600 text-white';
  }
};

export default function OrderStatusBadge({
  status,
  className,
}: OrderStatusBadgeProps) {
  return (
    <Button
      className={cn(
        'min-w-[120px] rounded-full px-6 font-semibold',
        getStatusStyle(status),
        className
      )}
    >
      {status}
    </Button>
  );
}
