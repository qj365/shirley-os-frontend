/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GetOrderResponse = {
  id: number;
  total: number;
  fulfillmentStatus: string | null;
  paymentStatus: string | null;
  trackingNumber?: string;
  courierCode?: string;
  courierName?: string;
  orderAt?: string;
  createdAt: string;
  orderItems: Array<{
    orderItemInfo?: {
      compareAtPrice: number;
      price: number;
      image: string;
      productName: string;
    };
    productVariant: {
      compareAtPrice: number;
      price: number;
      image: string;
      name: string;
      id: number;
    };
    total: number;
    quantity: number;
    id: number;
  }>;
  orderInfo?: {
    billingCountry?: string;
    billingZipCode?: string;
    billingProvince?: string;
    billingCity?: string;
    billingAddress2?: string;
    billingAddress1?: string;
    shippingCountry?: string;
    shippingZipCode?: string;
    shippingProvince?: string;
    shippingCity?: string;
    shippingAddress2?: string;
    shippingAddress1?: string;
    note?: string;
    email?: string;
    phone?: string;
    name?: string;
  };
};

