/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { _36_Enums_ProductStatus } from './_36_Enums_ProductStatus';
import type { CreateProductVariantDto } from './CreateProductVariantDto';
import type { PrismaJson_VariantOptions } from './PrismaJson_VariantOptions';
export type CreateProductDto = {
  name: string;
  sku: string;
  description: string;
  images: Array<string>;
  variantOptions: PrismaJson_VariantOptions;
  productVariants: Array<CreateProductVariantDto>;
  categoryId: number;
  status: _36_Enums_ProductStatus;
};

