/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationEvent } from './NotificationEvent';
import type { PrismaJson_NotificationData } from './PrismaJson_NotificationData';
export type AdminGetAllNotificationResponse = {
  id: number;
  title: string;
  description: string | null;
  event: NotificationEvent;
  isRead: boolean;
  data: PrismaJson_NotificationData | null;
  createdAt: string;
};

