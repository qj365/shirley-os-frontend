/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PrismaJson_VariantOptions } from './PrismaJson_VariantOptions';
export type GetProductBySlugResponse = {
  id: number;
  name: string;
  images: Array<string>;
  description: string;
  productVariants: Array<{
    minOrder: number;
    variantOptionIds: Array<number>;
    image: string;
    stock: number;
    compareAtPrice: number;
    price: number;
    id: number;
  }>;
  variantOptions: PrismaJson_VariantOptions;
  category: {
    id: number;
  };
};

