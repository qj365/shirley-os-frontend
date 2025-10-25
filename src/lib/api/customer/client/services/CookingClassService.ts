/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CursorPagingResponse_GetCookingClassesResponse_Array_ } from '../models/CursorPagingResponse_GetCookingClassesResponse_Array_';
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
}
