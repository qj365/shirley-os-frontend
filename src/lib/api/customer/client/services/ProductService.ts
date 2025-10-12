/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CursorPagingResponse_GetProductsByCategoryResponse_Array_ } from '../models/CursorPagingResponse_GetProductsByCategoryResponse_Array_';
import type { GetAllProductsResponse } from '../models/GetAllProductsResponse';
import type { GetProductBySlugResponse } from '../models/GetProductBySlugResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ProductService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns CursorPagingResponse_GetProductsByCategoryResponse_Array_ Ok
   * @throws ApiError
   */
  public getProductsByCategory({
    categoryId,
    cursor,
    pageSize = 10,
  }: {
    categoryId: number,
    cursor?: string,
    pageSize?: number,
  }): CancelablePromise<CursorPagingResponse_GetProductsByCategoryResponse_Array_> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer/products',
      query: {
        'cursor': cursor,
        'pageSize': pageSize,
        'categoryId': categoryId,
      },
      errors: {
        400: `Bad request`,
        403: `Forbidden`,
        404: `Not found`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * @returns GetAllProductsResponse Ok
   * @throws ApiError
   */
  public getAllProducts(): CancelablePromise<GetAllProductsResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer/products/all',
      errors: {
        400: `Bad request`,
        403: `Forbidden`,
        404: `Not found`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * @returns GetProductBySlugResponse Ok
   * @throws ApiError
   */
  public getProductBySlug({
    slug,
  }: {
    slug: string,
  }): CancelablePromise<GetProductBySlugResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer/products/{slug}',
      path: {
        'slug': slug,
      },
      errors: {
        400: `Bad request`,
        403: `Forbidden`,
        404: `Not found`,
        500: `Internal server error`,
      },
    });
  }
}
