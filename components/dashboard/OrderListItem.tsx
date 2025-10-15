import { ChevronRight, Store } from 'lucide-react';
import { Button } from '../ui/button';

type Props = {
  item: {
    id: string;
    store: string;
    amount: number;
    status: string;
  };
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Process':
      return 'bg-[#22C55E] hover:bg-[#16A34A] text-white';
    case 'Cancelled':
      return 'bg-[#DC2626] hover:bg-[#B91C1C] text-white';
    case 'Delivered':
      return 'bg-[#F3C03F] hover:bg-[#E5B338] text-black';
    default:
      return 'bg-gray-500 hover:bg-gray-600 text-white';
  }
};

export default function OrderListItem({ item }: Props) {
  return (
    <div className="flex justify-between gap-4 rounded-[10px] border border-[#EEE] bg-white px-3 py-2 transition-shadow hover:shadow-md sm:items-center md:!p-4">
      {/* Left Section - Order Info */}
      <div className="flex flex-col gap-2 md:flex-1 md:flex-row md:items-center md:gap-4">
        <h3 className="shrink-0 text-lg text-[#E70303] md:text-xl md:font-semibold">
          Order {item.id}
        </h3>
        <div className="flex items-center gap-2 text-[#313131]">
          <Store className="h-4 w-4 shrink-0" />
          <span
            className="line-clamp-2 overflow-hidden text-sm text-ellipsis md:max-w-[300px] md:text-base"
            title={item.store}
          >
            {item.store}
          </span>
        </div>
      </div>

      {/* Right Section - Status and Price */}
      <div className="flex flex-col items-center gap-2 md:max-w-[250px] md:flex-1 md:flex-row md:justify-between">
        <Button
          className={`size-8 min-w-[100px] rounded-full font-semibold ${getStatusStyle(item.status)}`}
        >
          {item.status}
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-black md:text-xl">
            £{item.amount.toFixed(2)}
          </span>
          <ChevronRight className="h-5 w-5 !font-bold text-gray-400" />
        </div>
      </div>
    </div>
  );
}
