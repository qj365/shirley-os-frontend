/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { _36_Enums_ProductStatus } from '../models/_36_Enums_ProductStatus';
import type { CreateProductDto } from '../models/CreateProductDto';
import type { CursorPagingResponse_GetProductsByCategoryResponse_Array_ } from '../models/CursorPagingResponse_GetProductsByCategoryResponse_Array_';
import type { GetAllProductsResponse } from '../models/GetAllProductsResponse';
import type { GetProductBySlugResponse } from '../models/GetProductBySlugResponse';
import type { GetProductResponse } from '../models/GetProductResponse';
import type { NumberedPagingResponse_GetProductsResponse_Array_ } from '../models/NumberedPagingResponse_GetProductsResponse_Array_';
import type { ProductStatsResponse } from '../models/ProductStatsResponse';
import type { TemplateVariantOptionsResponse } from '../models/TemplateVariantOptionsResponse';
import type { UpdateProductDto } from '../models/UpdateProductDto';
import type { VariantOptionsDto } from '../models/VariantOptionsDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ProductService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns CursorPagingResponse_GetProductsByCategoryResponse_Array_ Ok
   * @throws ApiError
   */
  public getProductsByCategory({
    categoryId,
    cursor,
    pageSize = 10,
  }: {
    categoryId: number,
    cursor?: string,
    pageSize?: number,
  }): CancelablePromise<CursorPagingResponse_GetProductsByCategoryResponse_Array_> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer/products',
      query: {
        'cursor': cursor,
        'pageSize': pageSize,
        'categoryId': categoryId,
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
   * @returns GetAllProductsResponse Ok
   * @throws ApiError
   */
  public getAllProducts(): CancelablePromise<GetAllProductsResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer/products/all',
      errors: {
        400: `Bad request`,
        403: `Forbidden`,
        404: `Not found`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * @returns GetProductBySlugResponse Ok
   * @throws ApiError
   */
  public getProductBySlug({
    slug,
  }: {
    slug: string,
  }): CancelablePromise<GetProductBySlugResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer/products/{slug}',
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
    status,
  }: {
    page?: number,
    pageSize?: number,
    keyword?: string,
    categoryId?: number,
    status?: _36_Enums_ProductStatus,
  }): CancelablePromise<NumberedPagingResponse_GetProductsResponse_Array_> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/products',
      query: {
        'page': page,
        'pageSize': pageSize,
        'keyword': keyword,
        'categoryId': categoryId,
        'status': status,
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
   * @returns ProductStatsResponse Ok
   * @throws ApiError
   */
  public getProductStats({
    page = 1,
    pageSize = 10,
    keyword,
    categoryId,
    status,
  }: {
    page?: number,
    pageSize?: number,
    keyword?: string,
    categoryId?: number,
    status?: _36_Enums_ProductStatus,
  }): CancelablePromise<ProductStatsResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/products/stats',
      query: {
        'page': page,
        'pageSize': pageSize,
        'keyword': keyword,
        'categoryId': categoryId,
        'status': status,
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
  /**
   * @returns any Ok
   * @throws ApiError
   */
  public updateProduct({
    id,
    requestBody,
  }: {
    id: number,
    requestBody: UpdateProductDto,
  }): CancelablePromise<{
    id: number;
  }> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/admin/products/{id}',
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
  public deleteProduct({
    id,
  }: {
    id: number,
  }): CancelablePromise<{
    id: number;
  }> {
    return this.httpRequest.request({
      method: 'DELETE',
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
