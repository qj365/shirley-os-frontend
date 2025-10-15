/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { _36_Enums_UserRole } from './_36_Enums_UserRole';
/**
 * From T, pick a set of properties whose keys are in the union K
 */
export type Pick_User_Exclude_keyofUser_createdAt_or_updatedAt__ = {
  id: number;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isVerified: boolean;
  role: _36_Enums_UserRole;
};

