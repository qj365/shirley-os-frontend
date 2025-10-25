/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminCreateCookingClassDto } from '../models/AdminCreateCookingClassDto';
import type { AdminCreateCookingClassScheduleDto } from '../models/AdminCreateCookingClassScheduleDto';
import type { AdminGetCookingClassByIdResponse } from '../models/AdminGetCookingClassByIdResponse';
import type { AdminGetCookingClassesResponse } from '../models/AdminGetCookingClassesResponse';
import type { AdminUpdateCookingClassDto } from '../models/AdminUpdateCookingClassDto';
import type { AdminUpdateCookingClassScheduleDto } from '../models/AdminUpdateCookingClassScheduleDto';
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
  /**
   * @returns AdminGetCookingClassesResponse Ok
   * @throws ApiError
   */
  public getCookingClasses({
    name,
    startDate,
    endDate,
  }: {
    name?: string,
    startDate?: string,
    endDate?: string,
  }): CancelablePromise<Array<AdminGetCookingClassesResponse>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/cooking-classes',
      query: {
        'name': name,
        'startDate': startDate,
        'endDate': endDate,
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
  public createCookingClass({
    requestBody,
  }: {
    requestBody: AdminCreateCookingClassDto,
  }): CancelablePromise<{
    id: number;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/cooking-classes',
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
   * @returns AdminGetCookingClassByIdResponse Ok
   * @throws ApiError
   */
  public getCookingClass({
    id,
  }: {
    id: number,
  }): CancelablePromise<AdminGetCookingClassByIdResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/cooking-classes/{id}',
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
  public updateCookingClass({
    id,
    requestBody,
  }: {
    id: number,
    requestBody: AdminUpdateCookingClassDto,
  }): CancelablePromise<{
    id: number;
  }> {
    return this.httpRequest.request({
      method: 'PATCH',
      url: '/admin/cooking-classes/{id}',
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
  public deleteCookingClass({
    id,
  }: {
    id: number,
  }): CancelablePromise<{
    id: number;
  }> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/cooking-classes/{id}',
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
  public deleteCookingClassSchedules({
    requestBody,
  }: {
    requestBody: {
      ids: Array<number>;
    },
  }): CancelablePromise<{
    message: string;
  }> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/cooking-classes/schedule',
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
  public createCookingClassSchedule({
    requestBody,
  }: {
    requestBody: AdminCreateCookingClassScheduleDto,
  }): CancelablePromise<{
    id: number;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/cooking-classes/schedule',
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
  public updateCookingClassSchedule({
    id,
    requestBody,
  }: {
    id: number,
    requestBody: AdminUpdateCookingClassScheduleDto,
  }): CancelablePromise<{
    id: number;
  }> {
    return this.httpRequest.request({
      method: 'PATCH',
      url: '/admin/cooking-classes/schedule/{id}',
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
