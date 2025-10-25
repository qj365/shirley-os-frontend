/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { _36_Enums_PaymentStatus } from './_36_Enums_PaymentStatus';
export type GetBookingByIdResponse = {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  note: string;
  bookingFor: string;
  specialRequest: string;
  paymentStatus: _36_Enums_PaymentStatus;
  cookingClass: {
    address: string;
    duration: number;
    description: string;
    price: number;
    image: string;
    name: string;
    id: number;
  };
  schedule: {
    dateTime: string;
    id: number;
  };
  createdAt: string;
};

