/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminGetCookingClassByIdResponse = {
  cookingClassSchedules: Array<{
    availableSlots: number;
    maxSlots: number;
    dateTime: string;
  }>;
  address: string;
  duration: number;
  whatToExpect: string;
  description: string;
  price: number;
  image: string;
  name: string;
  id: number;
};

