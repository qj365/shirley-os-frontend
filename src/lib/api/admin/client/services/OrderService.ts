/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CursorPagingResponse_GetOrdersResponse_Array_ } from '../models/CursorPagingResponse_GetOrdersResponse_Array_';
import type { GetOrderResponse } from '../models/GetOrderResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class OrderService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Get user orders
   * Get all orders for authenticated user
   * @returns CursorPagingResponse_GetOrdersResponse_Array_ Ok
   * @throws ApiError
   */
  public getOrders({
    cursor,
    pageSize = 10,
  }: {
    cursor?: string,
    pageSize?: number,
  }): CancelablePromise<CursorPagingResponse_GetOrdersResponse_Array_> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer/orders',
      query: {
        'cursor': cursor,
        'pageSize': pageSize,
      },
      errors: {
        400: `Bad request`,
        401: `Invalid token`,
        403: `Forbidden`,
        404: `Not found`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Get order by ID
   * Get order details by ID
   * @returns GetOrderResponse Ok
   * @throws ApiError
   */
  public getOrderById({
    orderId,
  }: {
    orderId: number,
  }): CancelablePromise<GetOrderResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer/orders/{orderId}',
      path: {
        'orderId': orderId,
      },
      errors: {
        400: `Bad request`,
        401: `Invalid token`,
        403: `Forbidden`,
        404: `Not found`,
        500: `Internal server error`,
      },
    });
  }
}
