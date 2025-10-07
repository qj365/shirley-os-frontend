/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PrismaJson_ProductImages } from './PrismaJson_ProductImages';
import type { PrismaJson_VariantOptions } from './PrismaJson_VariantOptions';
export type GetProductResponse = {
  category: {
    name: string;
    id: number;
  };
  productVariants: Array<{
    compareAtPrice: number;
    price: number;
    variantOptionIds: Array<number>;
    image: string;
    sku: string;
    name: string;
    id: number;
  }>;
  variantOptions: PrismaJson_VariantOptions;
  description: string;
  sku: string;
  images: PrismaJson_ProductImages;
  name: string;
  id: number;
};

