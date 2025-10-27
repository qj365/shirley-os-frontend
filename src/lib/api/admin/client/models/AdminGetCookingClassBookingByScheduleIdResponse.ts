/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { _36_Enums_PaymentStatus } from './_36_Enums_PaymentStatus';
export type AdminGetCookingClassBookingByScheduleIdResponse = {
  createdAt: string;
  paymentStatus: _36_Enums_PaymentStatus;
  specialRequest: string | null;
  bookingFor: string;
  numberOfPeople: number;
  phone: string;
  email: string;
  fullname: string;
  id: number;
};

