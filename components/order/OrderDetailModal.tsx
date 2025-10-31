/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { api } from '@/src/lib/api/customer';
import { GetOrderByIdResponse } from '@/src/lib/api/customer/client';
import { SHIPPING_FEE } from '@/utils/constants';
import formatDisplayCurrency from '@/utils/helpers/formatDisplayCurrency';
import { Calendar, Mail, MapPin, Package, Phone, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number | null;
}

export function OrderDetailModal({
  isOpen,
  onClose,
  orderId,
}: OrderDetailModalProps) {
  const [orderDetails, setOrderDetails] = useState<GetOrderByIdResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, orderId]);

  const fetchOrderDetails = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await api.order.getOrderById({ id: orderId });
      setOrderDetails(response);
    } catch (err) {
      setError('Failed to fetch order details. Please try again.');
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: string | null) => {
    switch (status) {
      case 'FULFILLED':
        return 'FULFILLED';
      case 'UNFULFILLED':
        return 'UNFULFILLED';
      case 'CANCELLED':
        return 'CANCELLED';
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

  const formatAddress = (address: {
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    zipCode: string | null;
    country: string | null;
  }) => {
    const parts = [
      address.address1,
      address.address2,
      address.city,
      address.province,
      address.zipCode,
      address.country,
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-full max-w-4xl overflow-y-auto border-none bg-white p-0 shadow">
        <DialogHeader className="sticky top-0 z-10 border-b bg-white px-6 py-4">
          <DialogTitle className="text-xl font-semibold">
            Order Details
            {orderDetails && (
              <span className="ml-2 text-sm font-normal">
                #{orderDetails.orderCode || orderDetails.id}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#F3C03F]"></div>
                <p className="mt-4">Loading order details...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-red-700">
              {error}
              <Button
                onClick={fetchOrderDetails}
                variant="outline"
                size="sm"
                className="ml-4"
              >
                Retry
              </Button>
            </div>
          )}

          {orderDetails && !loading && (
            <div className="space-y-6">
              {/* Order Status and Basic Info */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-[10px] border border-[#EEE] bg-white px-3 py-2 transition-shadow md:!p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">Order Date</span>
                  </div>
                  <p className="text-sm">
                    {orderDetails.orderAt
                      ? new Date(orderDetails.orderAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )
                      : 'N/A'}
                  </p>
                </div>

                <div className="rounded-[10px] border border-[#EEE] bg-white px-3 py-2 transition-shadow md:!p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <Button
                    className={`inline-flex h-6 rounded-full px-3 text-xs font-semibold ${getStatusStyle(
                      orderDetails.fulfillmentStatus
                    )}`}
                  >
                    {getStatusDisplay(orderDetails.fulfillmentStatus)}
                  </Button>
                </div>
              </div>

              {/* Order Items */}
              <div className="rounded-[10px] border border-[#EEE] bg-white px-3 py-2 transition-shadow md:!p-4">
                <div className="border-b px-4 py-3">
                  <h3 className="text-sm font-medium">Order Items</h3>
                </div>
                <div className="divide-y">
                  {orderDetails.orderItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm">{item.productName}</p>
                        <div className="mt-1 flex items-center gap-4 text-sm">
                          <span>Qty: {item.quantity}</span>
                          <span>
                            Price: {formatDisplayCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatDisplayCurrency(item.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t px-4 py-3">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-700">Shipping Fee:</span>
                    <span className="font-semibold text-gray-900">
                      {formatDisplayCurrency(
                        orderDetails.shippingFee || SHIPPING_FEE
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatDisplayCurrency(orderDetails.total)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              {orderDetails.orderInfo && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Shipping Address */}
                  <div className="rounded-[10px] border border-[#EEE] bg-white px-3 py-2 transition-shadow md:!p-4">
                    <div className="border-b px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <h3 className="text-sm font-medium">
                          Shipping Address
                        </h3>
                      </div>
                    </div>
                    <div className="p-4">
                      {orderDetails.orderInfo.name && (
                        <p className="font-medium">
                          {orderDetails.orderInfo.name}
                        </p>
                      )}
                      <p className="text-sm">
                        {formatAddress({
                          address1: orderDetails.orderInfo.shippingAddress1,
                          address2: orderDetails.orderInfo.shippingAddress2,
                          city: orderDetails.orderInfo.shippingCity,
                          province: orderDetails.orderInfo.shippingProvince,
                          zipCode: orderDetails.orderInfo.shippingZipCode,
                          country: orderDetails.orderInfo.shippingCountry,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="rounded-[10px] border border-[#EEE] bg-white px-3 py-2 transition-shadow md:!p-4">
                    <div className="border-b px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <h3 className="text-sm font-medium">Billing Address</h3>
                      </div>
                    </div>
                    <div className="p-4">
                      {orderDetails.orderInfo.name && (
                        <p className="font-medium">
                          {orderDetails.orderInfo.name}
                        </p>
                      )}
                      <p className="text-sm">
                        {formatAddress({
                          address1: orderDetails.orderInfo.billingAddress1,
                          address2: orderDetails.orderInfo.billingAddress2,
                          city: orderDetails.orderInfo.billingCity,
                          province: orderDetails.orderInfo.billingProvince,
                          zipCode: orderDetails.orderInfo.billingZipCode,
                          country: orderDetails.orderInfo.billingCountry,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {orderDetails.orderInfo && (
                <div className="rounded-[10px] border border-[#EEE] bg-white px-3 py-2 transition-shadow md:!p-4">
                  <div className="border-b px-4 py-3">
                    <h3 className="text-sm font-medium">Contact Information</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {orderDetails.orderInfo.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">
                            {orderDetails.orderInfo.email}
                          </span>
                        </div>
                      )}
                      {orderDetails.orderInfo.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">
                            {orderDetails.orderInfo.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tracking Information */}
              {(orderDetails.trackingNumber || orderDetails.courierName) && (
                <div className="rounded-[10px] border border-[#EEE] bg-white px-3 py-2 transition-shadow md:!p-4">
                  <div className="border-b px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      <h3 className="text-sm font-medium">
                        Tracking Information
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {orderDetails.trackingNumber && (
                        <div>
                          <span className="text-sm font-medium">
                            Tracking Number:
                          </span>
                          <p className="text-sm">
                            {orderDetails.trackingNumber}
                          </p>
                        </div>
                      )}
                      {orderDetails.courierName && (
                        <div>
                          <span className="text-sm font-medium">Courier:</span>
                          <p className="text-sm">
                            {orderDetails.courierName}
                            {orderDetails.courierCode &&
                              ` (${orderDetails.courierCode})`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Order Notes */}
              {orderDetails.orderInfo?.note && (
                <div className="rounded-[10px] border border-[#EEE] bg-white px-3 py-2 transition-shadow md:!p-4">
                  <div className="border-b px-4 py-3">
                    <h3 className="text-sm font-medium">Order Notes</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm">{orderDetails.orderInfo.note}</p>
                  </div>
                </div>
              )}

              {/* Cancel Note */}
              {orderDetails.orderCancelNote && (
                <div className="rounded-lg border border-red-200 bg-red-50">
                  <div className="border-b border-red-200 bg-red-100 px-4 py-3">
                    <h3 className="text-sm font-medium text-red-900">
                      Cancellation Note
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-red-700">
                      {orderDetails.orderCancelNote}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
