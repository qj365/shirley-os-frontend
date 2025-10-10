/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetCategoriesResponse } from '../models/GetCategoriesResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CategoryService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns GetCategoriesResponse Ok
   * @throws ApiError
   */
  public getCategories(): CancelablePromise<Array<GetCategoriesResponse>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer/categories',
      errors: {
        400: `Bad request`,
        403: `Forbidden`,
        404: `Not found`,
        500: `Internal server error`,
      },
    });
  }
}
