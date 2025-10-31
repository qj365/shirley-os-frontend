/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GetOrderByIdResponse = {
  orderInfo: {
    billingCountry: string | null;
    billingZipCode: string | null;
    billingProvince: string | null;
    billingCity: string | null;
    billingAddress2: string | null;
    billingAddress1: string | null;
    shippingCountry: string | null;
    shippingZipCode: string | null;
    shippingProvince: string | null;
    shippingCity: string | null;
    shippingAddress2: string | null;
    shippingAddress1: string | null;
    note: string | null;
    email: string | null;
    phone: string | null;
    name: string | null;
  } | null;
  orderItems: Array<{
    productName: string;
    total: number;
    quantity: number;
    price: number;
    image: string;
    name: string;
    id: number;
  }>;
  orderCancelNote: string | null;
  courierName: string | null;
  courierCode: string | null;
  trackingNumber: string | null;
  orderAt: string | null;
  fulfillmentStatus: string | null;
  shippingFee: number;
  subTotal: number;
  total: number;
  orderCode: string | null;
  id: number;
};

