/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminModifyCategoryDto } from '../models/AdminModifyCategoryDto';
import type { NumberedPagingResponse_AdminGetCategoriesResponse_Array_ } from '../models/NumberedPagingResponse_AdminGetCategoriesResponse_Array_';
import type { Omit_User_createdAt_or_updatedAt_ } from '../models/Omit_User_createdAt_or_updatedAt_';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns Omit_User_createdAt_or_updatedAt_ Ok
   * @throws ApiError
   */
  public adminGetMe(): CancelablePromise<Omit_User_createdAt_or_updatedAt_> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/me',
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
   * @returns NumberedPagingResponse_AdminGetCategoriesResponse_Array_ Ok
   * @throws ApiError
   */
  public adminCategoryGetAll({
    page = 1,
    pageSize = 10,
    name,
  }: {
    page?: number,
    pageSize?: number,
    name?: string,
  }): CancelablePromise<NumberedPagingResponse_AdminGetCategoriesResponse_Array_> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/categories',
      query: {
        'page': page,
        'pageSize': pageSize,
        'name': name,
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
  public adminCategoryCreate({
    requestBody,
  }: {
    requestBody: AdminModifyCategoryDto,
  }): CancelablePromise<{
    id: number;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/categories',
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
  public adminCategoryEdit({
    id,
    requestBody,
  }: {
    id: number,
    requestBody: AdminModifyCategoryDto,
  }): CancelablePromise<{
    id: number;
  }> {
    return this.httpRequest.request({
      method: 'PATCH',
      url: '/admin/categories/{id}',
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
  public adminCategoryDelete({
    id,
  }: {
    id: number,
  }): CancelablePromise<{
    id: number;
  }> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/categories/{id}',
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
