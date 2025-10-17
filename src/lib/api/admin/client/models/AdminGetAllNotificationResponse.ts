/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { _36_Enums_NotificationEvent } from './_36_Enums_NotificationEvent';
import type { PrismaJson_NotificationData } from './PrismaJson_NotificationData';
export type AdminGetAllNotificationResponse = {
  id: number;
  title: string;
  description: string | null;
  event: _36_Enums_NotificationEvent;
  isRead: boolean;
  data: PrismaJson_NotificationData | null;
  createdAt: string;
};

