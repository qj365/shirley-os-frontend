/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CursorPagingResponse_AdminGetAllNotificationResponse_Array_ } from '../models/CursorPagingResponse_AdminGetAllNotificationResponse_Array_';
import type { UpdateNotificationSettingDto } from '../models/UpdateNotificationSettingDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class NotificationsService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns CursorPagingResponse_AdminGetAllNotificationResponse_Array_ Ok
   * @throws ApiError
   */
  public adminNotificationGetAll({
    cursor,
    pageSize = 10,
  }: {
    cursor?: string,
    pageSize?: number,
  }): CancelablePromise<CursorPagingResponse_AdminGetAllNotificationResponse_Array_> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/notifications',
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
   * @returns any Ok
   * @throws ApiError
   */
  public adminNotificationGetSettings(): CancelablePromise<{
    userId: number;
    lowStockValue: number;
    lowStockNotification: boolean;
    updatedAt: string;
    createdAt: string;
    id: number;
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/notifications/notification-settings',
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
  public adminNotificationUpdateSettings({
    requestBody,
  }: {
    requestBody: UpdateNotificationSettingDto,
  }): CancelablePromise<{
    userId: number;
    lowStockValue: number;
    lowStockNotification: boolean;
    updatedAt: string;
    createdAt: string;
    id: number;
  }> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/admin/notifications/notification-settings',
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
