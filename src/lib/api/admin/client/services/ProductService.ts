/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateProductDto } from '../models/CreateProductDto';
import type { GetProductResponse } from '../models/GetProductResponse';
import type { NumberedPagingResponse_GetProductsResponse_Array_ } from '../models/NumberedPagingResponse_GetProductsResponse_Array_';
import type { TemplateVariantOptionsResponse } from '../models/TemplateVariantOptionsResponse';
import type { VariantOptionsDto } from '../models/VariantOptionsDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ProductService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns TemplateVariantOptionsResponse Ok
   * @throws ApiError
   */
  public getTemplateVariantOptions({
    requestBody,
  }: {
    requestBody: Array<VariantOptionsDto>,
  }): CancelablePromise<TemplateVariantOptionsResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/products/template-variant-options',
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
  public createProduct({
    requestBody,
  }: {
    requestBody: CreateProductDto,
  }): CancelablePromise<{
    id: number;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/products',
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
   * @returns NumberedPagingResponse_GetProductsResponse_Array_ Ok
   * @throws ApiError
   */
  public getProducts({
    page = 1,
    pageSize = 10,
    keyword,
    categoryId,
  }: {
    page?: number,
    pageSize?: number,
    keyword?: string,
    categoryId?: number,
  }): CancelablePromise<NumberedPagingResponse_GetProductsResponse_Array_> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/products',
      query: {
        'page': page,
        'pageSize': pageSize,
        'keyword': keyword,
        'categoryId': categoryId,
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
   * @returns boolean Ok
   * @throws ApiError
   */
  public checkExistingSku({
    sku,
  }: {
    sku: string,
  }): CancelablePromise<boolean> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/products/check-existing-sku/{sku}',
      path: {
        'sku': sku,
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
   * @returns GetProductResponse Ok
   * @throws ApiError
   */
  public getProduct({
    id,
  }: {
    id: number,
  }): CancelablePromise<GetProductResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/products/{id}',
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
