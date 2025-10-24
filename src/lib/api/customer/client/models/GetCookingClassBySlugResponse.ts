/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GetCookingClassBySlugResponse = {
  id: number;
  name: string;
  image: string;
  price: number;
  slug: string;
  description: string;
  banner: string;
  whatToExpect: string;
  duration: number;
  address: string;
  cookingClassSchedules: Array<{
    availableSlots: number;
    maxSlots: number;
    dateTime: string;
    id: number;
  }>;
};

