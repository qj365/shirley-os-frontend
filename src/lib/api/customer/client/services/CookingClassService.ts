/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCookingClassBookingDto } from '../models/CreateCookingClassBookingDto';
import type { CreateCookingClassBookingResponse } from '../models/CreateCookingClassBookingResponse';
import type { CursorPagingResponse_GetCookingClassesResponse_Array_ } from '../models/CursorPagingResponse_GetCookingClassesResponse_Array_';
import type { GetBookingByIdResponse } from '../models/GetBookingByIdResponse';
import type { GetCookingClassBySlugResponse } from '../models/GetCookingClassBySlugResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CookingClassService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns CursorPagingResponse_GetCookingClassesResponse_Array_ Ok
   * @throws ApiError
   */
  public customerGetCookingClasses({
    cursor,
    pageSize = 10,
  }: {
    cursor?: string,
    pageSize?: number,
  }): CancelablePromise<CursorPagingResponse_GetCookingClassesResponse_Array_> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer/cooking-classes',
      query: {
        'cursor': cursor,
        'pageSize': pageSize,
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
   * @returns GetBookingByIdResponse Ok
   * @throws ApiError
   */
  public getBookingBySessionId({
    sessionId,
  }: {
    sessionId: string,
  }): CancelablePromise<GetBookingByIdResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer/cooking-classes/booking/session/{sessionId}',
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
   * @returns GetCookingClassBySlugResponse Ok
   * @throws ApiError
   */
  public customerGetCookingClassBySlug({
    slug,
  }: {
    slug: string,
  }): CancelablePromise<GetCookingClassBySlugResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer/cooking-classes/{slug}',
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
  /**
   * @returns CreateCookingClassBookingResponse Ok
   * @throws ApiError
   */
  public createCookingClassBooking({
    requestBody,
  }: {
    requestBody: CreateCookingClassBookingDto,
  }): CancelablePromise<CreateCookingClassBookingResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/customer/cooking-classes/booking',
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
