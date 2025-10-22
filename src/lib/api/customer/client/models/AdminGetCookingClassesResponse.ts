/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminGetCookingClassesResponse = {
  cookingClassSchedules: Array<{
    availableSlots: number;
    maxSlots: number;
    dateTime: string;
  }>;
  address: string;
  price: number;
  image: string;
  name: string;
  id: number;
};

