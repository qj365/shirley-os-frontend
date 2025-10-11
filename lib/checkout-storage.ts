// Local storage utilities for checkout form persistence

import { CheckoutFormData, AddressFormData } from './checkout-validation'

const STORAGE_KEYS = {
  CHECKOUT_DATA: 'shirley_foods_checkout_data',
  CHECKOUT_TIMESTAMP: 'shirley_foods_checkout_timestamp'
} as const

// Storage expiry time (30 days in milliseconds)
const STORAGE_EXPIRY = 30 * 24 * 60 * 60 * 1000

// Check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = 'test'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

// Save checkout data to localStorage
export const saveCheckoutData = (data: Partial<CheckoutFormData>): void => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available')
    return
  }

  try {
    const timestamp = Date.now()
    const dataToSave = {
      ...data,
      timestamp
    }
    
    localStorage.setItem(STORAGE_KEYS.CHECKOUT_DATA, JSON.stringify(dataToSave))
    localStorage.setItem(STORAGE_KEYS.CHECKOUT_TIMESTAMP, timestamp.toString())
  } catch (error) {
    console.error('Failed to save checkout data to localStorage:', error)
  }
}

// Load checkout data from localStorage
export const loadCheckoutData = (): Partial<CheckoutFormData> | null => {
  if (!isLocalStorageAvailable()) {
    return null
  }

  try {
    const storedData = localStorage.getItem(STORAGE_KEYS.CHECKOUT_DATA)
    const storedTimestamp = localStorage.getItem(STORAGE_KEYS.CHECKOUT_TIMESTAMP)
    
    if (!storedData || !storedTimestamp) {
      return null
    }

    const timestamp = parseInt(storedTimestamp, 10)
    const now = Date.now()
    
    // Check if data has expired
    if (now - timestamp > STORAGE_EXPIRY) {
      clearCheckoutData()
      return null
    }

    const parsedData = JSON.parse(storedData)
    
    // Remove timestamp from returned data - using destructuring to omit it
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { timestamp: _timestamp, ...checkoutData } = parsedData
    
    return checkoutData
  } catch (error) {
    console.error('Failed to load checkout data from localStorage:', error)
    return null
  }
}

// Clear checkout data from localStorage
export const clearCheckoutData = (): void => {
  if (!isLocalStorageAvailable()) {
    return
  }

  try {
    localStorage.removeItem(STORAGE_KEYS.CHECKOUT_DATA)
    localStorage.removeItem(STORAGE_KEYS.CHECKOUT_TIMESTAMP)
  } catch (error) {
    console.error('Failed to clear checkout data from localStorage:', error)
  }
}

// Save specific field data
export const saveCheckoutField = <K extends keyof CheckoutFormData>(
  field: K,
  value: CheckoutFormData[K]
): void => {
  const existingData = loadCheckoutData() || {}
  const updatedData = {
    ...existingData,
    [field]: value
  }
  saveCheckoutData(updatedData)
}

// Load specific field data
export const loadCheckoutField = <K extends keyof CheckoutFormData>(
  field: K
): CheckoutFormData[K] | null => {
  const data = loadCheckoutData()
  return data?.[field] || null
}

// Save email
export const saveEmail = (email: string): void => {
  saveCheckoutField('email', email)
}

// Load email
export const loadEmail = (): string => {
  return loadCheckoutField('email') || ''
}

// Save shipping address
export const saveShippingAddress = (address: AddressFormData): void => {
  saveCheckoutField('shippingAddress', address)
}

// Load shipping address
export const loadShippingAddress = (): AddressFormData => {
  return loadCheckoutField('shippingAddress') || {
    first_name: '',
    last_name: '',
    address_1: '',
    city: '',
    country_code: 'GB',
    postal_code: ''
  }
}

// Save billing address
export const saveBillingAddress = (address: AddressFormData): void => {
  saveCheckoutField('billingAddress', address)
}

// Load billing address
export const loadBillingAddress = (): AddressFormData => {
  return loadCheckoutField('billingAddress') || {
    first_name: '',
    last_name: '',
    address_1: '',
    city: '',
    country_code: 'GB',
    postal_code: ''
  }
}

// Save billing preference
export const saveUseSameForBilling = (useSame: boolean): void => {
  saveCheckoutField('useSameForBilling', useSame)
}

// Load billing preference
export const loadUseSameForBilling = (): boolean => {
  return loadCheckoutField('useSameForBilling') ?? true
}

// Save payment type
export const savePaymentType = (paymentType: 'one-time' | 'subscription'): void => {
  saveCheckoutField('paymentType', paymentType)
}

// Load payment type
export const loadPaymentType = (): 'one-time' | 'subscription' => {
  return loadCheckoutField('paymentType') || 'one-time'
}

// Save subscription config
export const saveSubscriptionConfig = (config: { interval: 'MONTHLY' | 'YEARLY'; period: number }): void => {
  saveCheckoutField('subscriptionConfig', config)
}

// Load subscription config
export const loadSubscriptionConfig = (): { interval: 'MONTHLY' | 'YEARLY'; period: number } => {
  return loadCheckoutField('subscriptionConfig') || {
    interval: 'MONTHLY',
    period: 1
  }
}

// Utility to check if we have any saved data
export const hasSavedCheckoutData = (): boolean => {
  const data = loadCheckoutData()
  return data !== null && Object.keys(data).length > 0
}

// Get storage info for debugging
export const getStorageInfo = (): { hasData: boolean; timestamp: number | null; isExpired: boolean } => {
  if (!isLocalStorageAvailable()) {
    return { hasData: false, timestamp: null, isExpired: false }
  }

  const storedTimestamp = localStorage.getItem(STORAGE_KEYS.CHECKOUT_TIMESTAMP)
  const timestamp = storedTimestamp ? parseInt(storedTimestamp, 10) : null
  const now = Date.now()
  const isExpired = timestamp ? (now - timestamp > STORAGE_EXPIRY) : false
  
  return {
    hasData: hasSavedCheckoutData(),
    timestamp,
    isExpired
  }
}