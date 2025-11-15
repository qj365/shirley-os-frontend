/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateCheckoutSessionDto = {
  items: Array<{
    quantity: number;
    productVariantId: number;
  }>;
  shippingInfo: {
    country: string;
    zipCode: string;
    province: string;
    city: string;
    address2?: string;
    address1: string;
    note?: string;
    email: string;
    phone: string;
    name: string;
  };
  billingInfo?: {
    country: string;
    zipCode: string;
    province: string;
    city: string;
    address2?: string;
    address1: string;
  };
};

