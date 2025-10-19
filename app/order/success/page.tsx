import { api } from '@/src/lib/api/customer';
import type { GetOrderByIdResponse } from '@/src/lib/api/customer/client/models/GetOrderByIdResponse';
import formatDisplayCurrency from '@/utils/helpers/formatDisplayCurrency';
import {
  ArrowRight,
  CheckCircle,
  Home,
  Mail,
  Package,
  ShoppingBag,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ClearCartOnSuccess from '@/components/order/ClearCartOnSuccess';

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { session_id } = await searchParams;

  // If no session ID provided
  if (!session_id) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="pt-24 md:pt-28 lg:pt-32">
          <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white p-8 text-center shadow-sm">
              <Package className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                Order Not Found
              </h2>
              <p className="mb-6 text-gray-600">No session ID provided.</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#FFD56A] bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] px-8 py-2 text-base font-semibold shadow-inner shadow-black/25 transition-all hover:from-[#F3C03F]/90 hover:to-[#FFBA0A]/90 active:scale-95"
              >
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fetch order from server
  let order: GetOrderByIdResponse | null = null;
  let error: string | null = null;

  try {
    order = await api.order.getOrderBySessionId({
      sessionId: session_id as string,
    });
  } catch (err: unknown) {
    console.error('Error fetching order:', err);
    error = err instanceof Error ? err.message : 'Failed to load order details';
  }

  // If error or no order found
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="pt-24 md:pt-28 lg:pt-32">
          <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white p-8 text-center shadow-sm">
              <Package className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                Order Not Found
              </h2>
              <p className="mb-6 text-gray-600">
                {error || "We couldn't find your order details."}
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#FFD56A] bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] px-8 py-2 text-base font-semibold shadow-inner shadow-black/25 transition-all hover:from-[#F3C03F]/90 hover:to-[#FFBA0A]/90 active:scale-95"
              >
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success - render order details
  return (
    <div className="min-h-screen bg-gray-50">
      <ClearCartOnSuccess />
      <div className="container pt-24 pb-16 md:pt-28 lg:pt-32">
        <div>
          {/* Success Header */}
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Order Confirmed!
            </h1>
            <p className="text-gray-600">
              Thank you for your order. We&apos;ll send you a confirmation email
              shortly.
            </p>
            {order.orderCode && (
              <p className="mt-2 text-sm text-gray-500">
                Order Code: {order.orderCode}
              </p>
            )}
          </div>

          {/* Email Confirmation Banner */}
          {order.orderInfo?.email && (
            <div className="mb-8 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Confirmation email sent to {order.orderInfo.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Order Items */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="font-semibold text-gray-900">Order Items</h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {order.orderItems?.map((item, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-gray-200 bg-gray-50">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.productName}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ShoppingBag className="h-5 w-5 text-gray-400" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatDisplayCurrency(item.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total - moved inside Order Items section */}
              </div>
              {order.total !== undefined && (
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pt-3">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-xl font-semibold text-gray-900">
                        {formatDisplayCurrency(order.total)}
                      </span>
                    </div>

                    {order.orderAt && (
                      <div className="text-xs text-gray-500">
                        Order placed on:{' '}
                        {new Date(order.orderAt).toLocaleDateString()}
                      </div>
                    )}

                    {order.fulfillmentStatus && (
                      <div className="text-xs text-gray-500">
                        Status: {order.fulfillmentStatus}
                      </div>
                    )}

                    {order.trackingNumber && (
                      <div className="text-xs text-gray-500">
                        Tracking: {order.trackingNumber}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Information */}
            {order.orderInfo && (
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="font-semibold text-gray-900">
                    Shipping Information
                  </h2>
                </div>

                <div className="p-6">
                  <div className="space-y-2 text-sm text-gray-700">
                    {order.orderInfo.name && (
                      <p className="font-medium">{order.orderInfo.name}</p>
                    )}
                    {order.orderInfo.shippingAddress1 && (
                      <p>{order.orderInfo.shippingAddress1}</p>
                    )}
                    {order.orderInfo.shippingAddress2 && (
                      <p>{order.orderInfo.shippingAddress2}</p>
                    )}
                    <p>
                      {order.orderInfo.shippingCity}
                      {order.orderInfo.shippingProvince &&
                        `, ${order.orderInfo.shippingProvince}`}{' '}
                      {order.orderInfo.shippingZipCode}
                    </p>
                    <p>{order.orderInfo.shippingCountry}</p>
                    {order.orderInfo.phone && (
                      <p className="pt-2">Phone: {order.orderInfo.phone}</p>
                    )}
                    {order.orderInfo.note && (
                      <p className="pt-2 text-xs text-gray-500">
                        Note: {order.orderInfo.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Billing Information */}
            {order.orderInfo && (
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="font-semibold text-gray-900">
                    Billing Information
                  </h2>
                </div>

                <div className="p-6">
                  <div className="space-y-2 text-sm text-gray-700">
                    {order.orderInfo.billingAddress1 && (
                      <p>{order.orderInfo.billingAddress1}</p>
                    )}
                    {order.orderInfo.billingAddress2 && (
                      <p>{order.orderInfo.billingAddress2}</p>
                    )}
                    <p>
                      {order.orderInfo.billingCity}
                      {order.orderInfo.billingProvince &&
                        `, ${order.orderInfo.billingProvince}`}{' '}
                      {order.orderInfo.billingZipCode}
                    </p>
                    <p>{order.orderInfo.billingCountry}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white px-8 py-2 text-base font-semibold transition-all hover:bg-gray-50"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#FFD56A] bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] px-8 py-2 text-base font-semibold shadow-inner shadow-black/25 transition-all hover:from-[#F3C03F]/90 hover:to-[#FFBA0A]/90 active:scale-95"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
