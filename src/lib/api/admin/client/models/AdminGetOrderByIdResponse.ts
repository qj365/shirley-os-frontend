/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminGetOrderByIdResponse = {
  orderItems: Array<{
    total: number;
    quantity: number;
    price: number;
    image: string;
    name: string;
    id: number;
  }>;
  courierName: string | null;
  courierCode: string | null;
  trackingNumber: string | null;
  orderAt: string | null;
  fulfillmentStatus: string | null;
  total: number;
  orderCode: string | null;
  id: number;
};

