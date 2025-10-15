/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { _36_Enums_ProductStatus } from './_36_Enums_ProductStatus';
import type { PrismaJson_ProductImages } from './PrismaJson_ProductImages';
import type { PrismaJson_VariantOptions } from './PrismaJson_VariantOptions';
export type GetProductResponse = {
  category: {
    name: string;
    id: number;
  };
  productVariants: Array<{
    minOrder: number;
    compareAtPrice: number;
    price: number;
    variantOptionIds: Array<number>;
    image: string;
    sku: string;
    name: string;
    id: number;
  }>;
  variantOptions: PrismaJson_VariantOptions;
  status: _36_Enums_ProductStatus;
  description: string;
  sku: string;
  images: PrismaJson_ProductImages;
  name: string;
  id: number;
};

