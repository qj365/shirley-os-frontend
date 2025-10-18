/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { _36_Enums_FulfillmentStatus } from '../models/_36_Enums_FulfillmentStatus';
import type { AdminCancelOrderDto } from '../models/AdminCancelOrderDto';
import type { AdminFulfillOrderDto } from '../models/AdminFulfillOrderDto';
import type { AdminGetOrderByIdResponse } from '../models/AdminGetOrderByIdResponse';
import type { GetOrderByIdResponse } from '../models/GetOrderByIdResponse';
import type { NumberedPagingResponse_AdminGetOrdersResponse_Array_ } from '../models/NumberedPagingResponse_AdminGetOrdersResponse_Array_';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class OrderService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns GetOrderByIdResponse Ok
   * @throws ApiError
   */
  public getOrderBySessionId({
    sessionId,
  }: {
    sessionId: string,
  }): CancelablePromise<GetOrderByIdResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer/orders/session/{sessionId}',
      path: {
        'sessionId': sessionId,
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
   * @returns GetOrderByIdResponse Ok
   * @throws ApiError
   */
  public getOrderById({
    id,
  }: {
    id: number,
  }): CancelablePromise<GetOrderByIdResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer/orders/{id}',
      path: {
        'id': id,
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
   * @returns NumberedPagingResponse_AdminGetOrdersResponse_Array_ Ok
   * @throws ApiError
   */
  public adminOrderGetAll({
    page = 1,
    pageSize = 10,
    orderCode,
    startDate,
    endDate,
    fulfillmentStatus,
  }: {
    page?: number,
    pageSize?: number,
    orderCode?: string,
    startDate?: string,
    endDate?: string,
    fulfillmentStatus?: _36_Enums_FulfillmentStatus,
  }): CancelablePromise<NumberedPagingResponse_AdminGetOrdersResponse_Array_> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/orders',
      query: {
        'page': page,
        'pageSize': pageSize,
        'orderCode': orderCode,
        'startDate': startDate,
        'endDate': endDate,
        'fulfillmentStatus': fulfillmentStatus,
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
   * @returns any Ok
   * @throws ApiError
   */
  public adminOrderGetStats({
    page = 1,
    pageSize = 10,
    orderCode,
    startDate,
    endDate,
    fulfillmentStatus,
  }: {
    page?: number,
    pageSize?: number,
    orderCode?: string,
    startDate?: string,
    endDate?: string,
    fulfillmentStatus?: _36_Enums_FulfillmentStatus,
  }): CancelablePromise<{
    cancelled: number;
    fulfilled: number;
    unfulfilled: number;
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/orders/stats',
      query: {
        'page': page,
        'pageSize': pageSize,
        'orderCode': orderCode,
        'startDate': startDate,
        'endDate': endDate,
        'fulfillmentStatus': fulfillmentStatus,
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
   * @returns AdminGetOrderByIdResponse Ok
   * @throws ApiError
   */
  public adminOrderGetById({
    id,
  }: {
    id: number,
  }): CancelablePromise<AdminGetOrderByIdResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/orders/{id}',
      path: {
        'id': id,
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
   * @returns any Ok
   * @throws ApiError
   */
  public adminOrderCancel({
    id,
    requestBody,
  }: {
    id: number,
    requestBody: AdminCancelOrderDto,
  }): CancelablePromise<{
    id: number;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/cancel',
      path: {
        'id': id,
      },
      body: requestBody,
      mediaType: 'application/json',
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
   * @returns any Ok
   * @throws ApiError
   */
  public adminOrderFulfill({
    id,
    requestBody,
  }: {
    id: number,
    requestBody: AdminFulfillOrderDto,
  }): CancelablePromise<{
    id: number;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/fulfill',
      path: {
        'id': id,
      },
      body: requestBody,
      mediaType: 'application/json',
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
