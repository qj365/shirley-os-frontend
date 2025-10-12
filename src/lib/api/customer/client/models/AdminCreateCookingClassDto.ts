/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminCreateCookingClassDto = {
  name: string;
  image: string;
  price: number;
  description: string;
  whatToExpect: string;
  duration: number;
  address: string;
  cookingClassSchedules: Array<{
    maxSlots: number;
    dateTime: string;
  }>;
};

