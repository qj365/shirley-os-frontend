/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { _36_Enums_FulfillmentStatus } from './_36_Enums_FulfillmentStatus';
export type GetOrdersDto = {
  page?: number;
  pageSize?: number;
  orderCode?: string;
  startDate?: string;
  endDate?: string;
  fulfillmentStatus?: _36_Enums_FulfillmentStatus;
};

