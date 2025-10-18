'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  FileText,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { OrderDetailModal } from '@/components/order/OrderDetailModal';
import { api } from '@/src/lib/api/customer';
import {
  _36_Enums_FulfillmentStatus,
  GetOrdersResponse,
  NumberedPagingResponse_GetOrdersResponse_Array_,
} from '@/src/lib/api/customer/client';
import useDebounceSearch from '@/hooks/useDebounceSearch';

interface OrderFilters {
  orderCode: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  fulfillmentStatus: _36_Enums_FulfillmentStatus | '';
}

export default function OrdersHistory() {
  const [orders, setOrders] = useState<GetOrdersResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 1,
    totalPages: 0,
    total: 0,
  });
  const [filters, setFilters] = useState<OrderFilters>({
    orderCode: '',
    startDate: undefined,
    endDate: undefined,
    fulfillmentStatus: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use debounced search hook
  const { searchKeyword, setSearchKeyword, debounceSearchFn } =
    useDebounceSearch();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...(searchKeyword && { orderCode: searchKeyword }),
        ...(filters.startDate && {
          startDate: filters.startDate.toISOString().split('T')[0],
        }),
        ...(filters.endDate && {
          endDate: filters.endDate.toISOString().split('T')[0],
        }),
        ...(filters.fulfillmentStatus && {
          fulfillmentStatus: filters.fulfillmentStatus,
        }),
      };

      const response: NumberedPagingResponse_GetOrdersResponse_Array_ =
        await api.order.getOrders(params);

      setOrders(response.data);
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages,
        total: response.total,
      }));
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.pageSize,
    searchKeyword,
    filters.startDate,
    filters.endDate,
    filters.fulfillmentStatus,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle debounced search input
  const handleSearchInput = (value: string) => {
    setFilters(prev => ({ ...prev, orderCode: value }));
    debounceSearchFn(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (
    key: keyof OrderFilters,
    value: string | Date | undefined
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      orderCode: '',
      startDate: undefined,
      endDate: undefined,
      fulfillmentStatus: '',
    });
    setSearchKeyword('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleOrderClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  const getStatusDisplay = (status: string | null) => {
    switch (status) {
      case 'FULFILLED':
        return 'Delivered';
      case 'UNFULFILLED':
        return 'Process';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getStatusStyle = (status: string | null) => {
    switch (status) {
      case 'UNFULFILLED':
        return 'bg-[#22C55E] hover:bg-[#16A34A] text-white';
      case 'CANCELLED':
        return 'bg-[#DC2626] hover:bg-[#B91C1C] text-white';
      case 'FULFILLED':
        return 'bg-[#F3C03F] hover:bg-[#E5B338] text-black';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  return (
    <DashboardLayout activePage="/my-page/order">
      {/* Page Title */}
      <h1 className="mt-4 mb-6 text-xl font-bold text-black md:text-3xl lg:mb-8">
        Order History
      </h1>

      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by order code..."
              value={filters.orderCode}
              onChange={e => handleSearchInput(e.target.value)}
              className="pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center gap-2 border-none bg-[#F3C03F] hover:bg-[#E5B338]"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <DatePicker
                  value={filters.startDate}
                  onChange={date => handleFilterChange('startDate', date)}
                  placeholder="Select start date"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <DatePicker
                  value={filters.endDate}
                  onChange={date => handleFilterChange('endDate', date)}
                  placeholder="Select end date"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <Select
                  value={filters.fulfillmentStatus || 'all'}
                  onValueChange={(value: string) =>
                    handleFilterChange(
                      'fulfillmentStatus',
                      value === 'all' ? '' : value
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value={_36_Enums_FulfillmentStatus.UNFULFILLED}>
                      Process
                    </SelectItem>
                    <SelectItem value={_36_Enums_FulfillmentStatus.FULFILLED}>
                      Delivered
                    </SelectItem>
                    <SelectItem value={_36_Enums_FulfillmentStatus.CANCELLED}>
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={fetchOrders}
                className="bg-[#F3C03F] hover:bg-[#E5B338]"
              >
                Apply Filters
              </Button>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="bg-black text-white hover:opacity-80"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#F3C03F]"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
          <Button
            onClick={fetchOrders}
            variant="outline"
            size="sm"
            className="ml-4"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Orders List */}
      {!loading && !error && (
        <>
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                onClick={() => handleOrderClick(order.id)}
                className="flex cursor-pointer justify-between gap-4 rounded-[10px] border border-[#EEE] bg-white px-3 py-2 transition-shadow hover:shadow-md sm:items-center md:!p-4"
              >
                {/* Left Section - Order Info */}
                <div className="flex flex-col gap-2 md:flex-1 md:flex-row md:items-center md:gap-4">
                  <h3 className="shrink-0 text-lg text-[#E70303] md:text-xl md:font-semibold">
                    Order {order.orderCode || order.id}
                  </h3>
                  <div className="flex items-center gap-2 text-[#313131]">
                    <span className="text-sm text-gray-500">
                      {order.orderAt
                        ? new Date(order.orderAt).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Right Section - Status and Price */}
                <div className="flex flex-col items-center gap-2 md:max-w-[250px] md:flex-1 md:flex-row md:justify-between">
                  <Button
                    className={`size-8 min-w-[100px] rounded-full font-semibold ${getStatusStyle(order.fulfillmentStatus)}`}
                  >
                    {getStatusDisplay(order.fulfillmentStatus)}
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-black md:text-xl">
                      £{order.total.toFixed(2)}
                    </span>
                    <ChevronRight className="h-5 w-5 !font-bold text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state if no orders */}
          {orders.length === 0 && (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white">
              <div className="text-center">
                <FileText className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-xl font-semibold text-gray-700">
                  No orders found
                </h3>
                <p className="mt-2 text-gray-500">
                  {Object.values(filters).some(v => v)
                    ? 'Try adjusting your search criteria'
                    : 'Your order history will appear here'}
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {orders.length > 0 && pagination.totalPages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-between">
              <div className="text-sm text-gray-700">
                Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
                {Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.total
                )}{' '}
                of {pagination.total} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          variant={
                            pagination.page === pageNum ? 'default' : 'outline'
                          }
                          size="sm"
                          className={
                            pagination.page === pageNum
                              ? 'bg-[#F3C03F] hover:bg-[#E5B338]'
                              : ''
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>
                <Button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        orderId={selectedOrderId}
      />
    </DashboardLayout>
  );
}
