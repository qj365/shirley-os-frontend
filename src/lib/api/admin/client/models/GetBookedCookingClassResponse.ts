/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GetBookedCookingClassResponse = {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  bookingFor: string;
  specialRequest: string | null;
  paymentStatus: string;
  createdAt: string;
  numberOfPeople: number;
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
};

