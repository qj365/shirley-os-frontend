/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangePasswordDto } from '../models/ChangePasswordDto';
import type { OtpType } from '../models/OtpType';
import type { ResetPasswordDto } from '../models/ResetPasswordDto';
import type { SendOtp } from '../models/SendOtp';
import type { SignupDto } from '../models/SignupDto';
import type { VerifyOtpDto } from '../models/VerifyOtpDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns any Ok
   * @throws ApiError
   */
  public signup({
    requestBody,
  }: {
    requestBody: SignupDto,
  }): CancelablePromise<{
    message: string;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/auth/signup',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
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
  public sendOtpResetPassword({
    otpType,
    requestBody,
  }: {
    otpType: OtpType,
    requestBody: SendOtp,
  }): CancelablePromise<{
    message: string;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/auth/otp/{otpType}',
      path: {
        'otpType': otpType,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
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
  public verifyOtp({
    otpType,
    requestBody,
  }: {
    otpType: OtpType,
    requestBody: VerifyOtpDto,
  }): CancelablePromise<{
    token: any;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/auth/verify-otp/{otpType}',
      path: {
        'otpType': otpType,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
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
  public resetPassword({
    requestBody,
  }: {
    requestBody: ResetPasswordDto,
  }): CancelablePromise<{
    email: any;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/auth/reset-password',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
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
  public changePassword({
    requestBody,
  }: {
    requestBody: ChangePasswordDto,
  }): CancelablePromise<{
    message: string;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/auth/change-password',
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
