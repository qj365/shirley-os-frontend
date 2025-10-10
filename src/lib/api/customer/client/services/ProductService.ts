/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CursorPagingResponse_GetProductsByCategoryResponse_Array_ } from '../models/CursorPagingResponse_GetProductsByCategoryResponse_Array_';
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
}
