/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { _36_Enums_ProductStatus } from './_36_Enums_ProductStatus';
import type { UpdateProductVariantDto } from './UpdateProductVariantDto';
export type UpdateProductDto = {
  name: string;
  description: string;
  images: Array<string>;
  productVariants: Array<UpdateProductVariantDto>;
  categoryId: number;
  status: _36_Enums_ProductStatus;
};

