"use client"

import { sdk } from "@/config"

// Updated interfaces to match new API structure
export interface SubscriptionItem {
  product_id: string
  variant_id: string
  quantity: number
  metadata?: Record<string, unknown>
}

export interface GuestCustomer {
  email: string
  first_name: string
  last_name: string
  phone?: string
}

export interface Subscription {
  id: string
  customer_id: string
  interval: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | 'BI_MONTHLY' | 'QUARTERLY'
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED' | 'PAYMENT_FAILED'
  items: SubscriptionItem[]
  subscription_date: string
  expiration_date: string
  next_order_date: string
  metadata?: Record<string, unknown>
}

// Updated create subscription data for new API
export interface CreateSubscriptionData {
  interval: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | 'BI_MONTHLY' | 'QUARTERLY'
  items: SubscriptionItem[]
  // Flattened guest customer fields (for guest users)
  email?: string
  first_name?: string
  last_name?: string
  phone?: string
}

export interface UpdateSubscriptionData {
  status?: 'ACTIVE' | 'PAUSED' | 'CANCELLED'
  interval?: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | 'BI_MONTHLY' | 'QUARTERLY'
  order_id?: string
  metadata?: Record<string, unknown>
}

// Cart interfaces for type safety
interface CartItem {
  variant_id: string;
  quantity: number;
  product_id?: string;
  metadata?: Record<string, unknown>;
  variant?: {
    product_id?: string;
  };
}

interface Cart {
  items: CartItem[];
  email?: string;
  shipping_address?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
  billing_address?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
}

export interface SubscriptionsResponse {
  subscriptions: Subscription[]
  count: number
}

export interface SubscriptionResponse {
  subscription: Subscription
}

// Subscription API calls using MedusaJS SDK with correct format
export const getCustomerSubscriptions = async (): Promise<SubscriptionsResponse> => {
  try {
    const response = await sdk.client.fetch<SubscriptionsResponse>('/store/subscriptions', {
      method: 'GET'
    })
    return response
  } catch (error) {
    handleSubscriptionError(error as Error, 'getCustomerSubscriptions')
    throw error
  }
}

// Updated createSubscription for new API structure
export const createSubscription = async (subscriptionData: CreateSubscriptionData): Promise<SubscriptionResponse> => {
  try {
    console.log('Creating subscription with:', subscriptionData)
    
    // Ensure interval is uppercase as expected by backend
    const formattedData = {
      ...subscriptionData,
      interval: subscriptionData.interval.toUpperCase() as 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | 'BI_MONTHLY' | 'QUARTERLY'
    }
    
    // Check if this is a guest user (has email field but no authentication)
    const isGuestUser = !!subscriptionData.email
    
    const requestOptions: any = {
      method: 'POST',
      body: formattedData
    }
    
    if (isGuestUser) {
      console.log('Creating guest subscription with flattened customer data')
    }
    
    const response = await sdk.client.fetch<SubscriptionResponse>('/store/subscriptions', requestOptions)
    
    console.log('Subscription created successfully', response)
    return response
  } catch (error: unknown) {
    console.error('Subscription creation error:', error)
    
    // Enhanced error handling
    if (error && typeof error === 'object' && 'status' in error) {
      const statusError = error as { status: number };
      if (statusError.status === 401) {
        throw new Error('Authentication required. Please log in to create a subscription.')
      } else if (statusError.status === 400) {
        throw new Error('Invalid subscription data. Please check your cart items and try again.')
      } else if (statusError.status === 404) {
        throw new Error('Subscription service not available. Please contact support.')
      }
    }
    handleSubscriptionError(error as Error, 'createSubscription')
    throw error
  }
}

export const getSubscription = async (subscriptionId: string): Promise<SubscriptionResponse> => {
  try {
    const response = await sdk.client.fetch<SubscriptionResponse>(`/store/subscriptions/${subscriptionId}`, {
      method: 'GET'
    })
    return response
  } catch (error) {
    handleSubscriptionError(error as Error, 'getSubscription')
    throw error
  }
}

export const updateSubscription = async (subscriptionId: string, updateData: UpdateSubscriptionData): Promise<SubscriptionResponse> => {
  try {
    console.log('Updating subscription', { subscriptionId, updateData })    
    
    // Ensure status and interval are uppercase if provided
    const formattedData = {
      ...updateData,
      ...(updateData.status && { status: updateData.status.toUpperCase() }),
      ...(updateData.interval && { interval: updateData.interval.toUpperCase() })
    }
    
    const response = await sdk.client.fetch<SubscriptionResponse>(`/store/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      body: formattedData
    })
    
    console.log('Subscription updated successfully', response)
    return response
  } catch (error) {
    handleSubscriptionError(error as Error, 'updateSubscription')
    throw error
  }
}

export const cancelSubscription = async (subscriptionId: string): Promise<void> => {
  try {
    await sdk.client.fetch(`/store/subscriptions/${subscriptionId}`, {
      method: 'DELETE'
    })
    console.log('Subscription cancelled successfully')
  } catch (error) {
    handleSubscriptionError(error as Error, 'cancelSubscription')
    throw error
  }
}

// Error handling helper
export const handleSubscriptionError = (error: Error, context: string = ''): void => {
  console.error(`Subscription error in ${context}:`, error)
  
  // Enhanced error handling for new API
  const errorMessage = error.message || error.toString()
  
  if (errorMessage.includes('400')) {
    console.error('Invalid request data - check required fields')
  } else if (errorMessage.includes('401')) {
    console.error('Authentication required')
  } else if (errorMessage.includes('404')) {
    console.error('Product or variant not found')
  } else if (errorMessage.includes('500')) {
    console.error('Server error')
  }
}

// Utility functions
export const formatNextDelivery = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  })
}

export const getIntervalLabel = (interval: string): string => {
  const labels = {
    'WEEKLY': 'Weekly',
    'BI_WEEKLY': 'Every 2 weeks',
    'MONTHLY': 'Monthly',
    'BI_MONTHLY': 'Every 2 months',
    'QUARTERLY': 'Every 3 months'
  }
  return labels[interval as keyof typeof labels] || interval
}

// Debug logging (only in development)
const DEBUG_SUBSCRIPTIONS = process.env.NODE_ENV === 'development'

export const debugLog = (operation: string, data: unknown): void => {
  if (DEBUG_SUBSCRIPTIONS) {
    console.log(`[Subscription Debug] ${operation}:`, data)
  }
}

// Updated helper functions for new API structure
export const createSubscriptionItemsFromCart = (cart: Cart): SubscriptionItem[] => {
  if (!cart?.items || cart.items.length === 0) {
    return []
  }
  
  return cart.items.map((item: CartItem) => ({
    product_id: item?.variant?.product_id || item?.product_id || '',
    variant_id: item.variant_id,
    quantity: item.quantity,
    metadata: item.metadata || {}
  }))
}

export const createGuestCustomerFromCart = (cart: Cart): GuestCustomer | null => {
  if (!cart?.email) {
    return null
  }
  
  return {
    email: cart.email,
    first_name: cart.billing_address?.first_name || cart.shipping_address?.first_name || '',
    last_name: cart.billing_address?.last_name || cart.shipping_address?.last_name || '',
    phone: cart.billing_address?.phone || cart.shipping_address?.phone
  }
}

// New function for creating subscription from cart (supports both auth and guest)
export const createSubscriptionFromCart = async (
  cart: Cart, 
  interval: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | 'BI_MONTHLY' | 'QUARTERLY',
  isAuthenticated: boolean = false
): Promise<SubscriptionResponse> => {
  try {
    const items = createSubscriptionItemsFromCart(cart)
    
    if (items.length === 0) {
      throw new Error('No valid items found in cart for subscription')
    }
    
    const subscriptionData: any = {
      interval,
      items
    }
    
    // Add flattened guest customer data if user is not authenticated
    if (!isAuthenticated) {
      const guestCustomer = createGuestCustomerFromCart(cart)
      if (!guestCustomer) {
        throw new Error('Guest customer information is required for unauthenticated users')
      }
      
      // Flatten guest customer data directly into the request body
      subscriptionData.email = guestCustomer.email
      subscriptionData.first_name = guestCustomer.first_name
      subscriptionData.last_name = guestCustomer.last_name
      if (guestCustomer.phone) {
        subscriptionData.phone = guestCustomer.phone
      }
    }
    
    return await createSubscription(subscriptionData)
  } catch (error) {
    handleSubscriptionError(error as Error, 'createSubscriptionFromCart')
    throw error
  }
}

// Legacy function - kept for backward compatibility but now uses new API
export const getProductIdFromCart = (cart: Cart): string | null => {
  if (!cart?.items || cart.items.length === 0) {
    return null
  }
  
  // Get the first item's product_id (for backward compatibility)
  const firstItem = cart.items[0]
  return firstItem?.variant?.product_id || firstItem?.product_id || null
}

// Updated default export
const subscriptionService = {
  getCustomerSubscriptions,
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  handleSubscriptionError,
  formatNextDelivery,
  getIntervalLabel,
  debugLog,
  createSubscriptionItemsFromCart,
  createGuestCustomerFromCart,
  createSubscriptionFromCart,
  getProductIdFromCart // Legacy support
}

export default subscriptionService