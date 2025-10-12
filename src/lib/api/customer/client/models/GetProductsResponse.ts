/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { _36_Enums_ProductStatus } from './_36_Enums_ProductStatus';
import type { Dimension } from './Dimension';
export type GetProductsResponse = {
  stock: Dimension;
  category: {
    name: string;
    id: number;
  };
  status: _36_Enums_ProductStatus;
  image: string;
  prices: Dimension;
  sku: string;
  name: string;
  id: number;
};

