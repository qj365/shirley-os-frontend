/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { _36_Enums_FulfillmentStatus } from '../models/_36_Enums_FulfillmentStatus';
import type { CreateCheckoutSessionDto } from '../models/CreateCheckoutSessionDto';
import type { CreateCheckoutSessionResponse } from '../models/CreateCheckoutSessionResponse';
import type { GetOrderByIdResponse } from '../models/GetOrderByIdResponse';
import type { NumberedPagingResponse_GetOrdersResponse_Array_ } from '../models/NumberedPagingResponse_GetOrdersResponse_Array_';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class OrderService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns CreateCheckoutSessionResponse Ok
   * @throws ApiError
   */
  public createCheckoutSession({
    requestBody,
  }: {
    requestBody: CreateCheckoutSessionDto,
  }): CancelablePromise<CreateCheckoutSessionResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/customer/orders/checkout',
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
   * @returns NumberedPagingResponse_GetOrdersResponse_Array_ Ok
   * @throws ApiError
   */
  public getOrders({
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
  }): CancelablePromise<NumberedPagingResponse_GetOrdersResponse_Array_> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer/orders',
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
}
