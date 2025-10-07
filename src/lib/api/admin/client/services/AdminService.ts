/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
}
