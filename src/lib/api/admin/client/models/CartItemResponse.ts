/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CartItemResponse = {
  id: number;
  productVariantId: number;
  productVariant: {
    product: {
      slug: string;
      name: string;
    };
    minOrder: number;
    compareAtPrice: number;
    price: number;
    image: string;
    name: string;
    id: number;
  };
  quantity: number;
  createdAt: string;
  updatedAt: string;
};

