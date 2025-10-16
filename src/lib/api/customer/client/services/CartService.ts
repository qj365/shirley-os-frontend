/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddToCartDto } from '../models/AddToCartDto';
import type { CartItemResponse } from '../models/CartItemResponse';
import type { GetCartResponse } from '../models/GetCartResponse';
import type { UpdateCartItemDto } from '../models/UpdateCartItemDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CartService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Get cart
   * Get the current user's cart
   * @returns GetCartResponse Ok
   * @throws ApiError
   */
  public getCart(): CancelablePromise<GetCartResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer/cart',
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
   * Add to cart
   * Add a product variant to cart
   * @returns CartItemResponse Ok
   * @throws ApiError
   */
  public addToCart({
    requestBody,
  }: {
    requestBody: AddToCartDto,
  }): CancelablePromise<CartItemResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/customer/cart',
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
   * Clear cart
   * Clear all items from cart
   * @returns void
   * @throws ApiError
   */
  public clearCart(): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/customer/cart',
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
   * Update cart item
   * Update cart item quantity
   * @returns CartItemResponse Ok
   * @throws ApiError
   */
  public updateCartItem({
    cartItemId,
    requestBody,
  }: {
    cartItemId: number,
    requestBody: UpdateCartItemDto,
  }): CancelablePromise<CartItemResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/customer/cart/{cartItemId}',
      path: {
        'cartItemId': cartItemId,
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
   * Remove cart item
   * Remove an item from cart
   * @returns void
   * @throws ApiError
   */
  public removeCartItem({
    cartItemId,
  }: {
    cartItemId: number,
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/customer/cart/{cartItemId}',
      path: {
        'cartItemId': cartItemId,
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
