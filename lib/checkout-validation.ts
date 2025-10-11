// Validation library for checkout forms

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface AddressFormData {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  country_code: string
  postal_code: string
  phone?: string
  company?: string
}

export interface CheckoutFormData {
  email: string
  shippingAddress: AddressFormData
  billingAddress: AddressFormData
  useSameForBilling: boolean
  paymentType: 'one-time' | 'subscription'
  subscriptionConfig: {
    interval: 'MONTHLY' | 'YEARLY'
    period: number
  }
}

// Phone number validation
export const validatePhoneNumber = (phone: string, countryCode: string = 'GB'): ValidationResult => {
  if (!phone || phone.trim() === '') {
    return { isValid: true } // Phone is optional
  }

  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '')

  // Country-specific phone validation patterns
  const phonePatterns: Record<string, { pattern: RegExp; message: string; minLength: number; maxLength: number }> = {
    GB: {
      pattern: /^(\+44|0)[1-9]\d{8,9}$/,
      message: 'Please enter a valid UK phone number (e.g., +44 20 1234 5678 or 020 1234 5678)',
      minLength: 10,
      maxLength: 13
    },
    US: {
      pattern: /^(\+1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/,
      message: 'Please enter a valid US phone number (e.g., +1 555 123 4567 or 555-123-4567)',
      minLength: 10,
      maxLength: 11
    },
    CA: {
      pattern: /^(\+1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/,
      message: 'Please enter a valid Canadian phone number (e.g., +1 416 123 4567)',
      minLength: 10,
      maxLength: 11
    },
    AU: {
      pattern: /^(\+61|0)[2-478]\d{8}$/,
      message: 'Please enter a valid Australian phone number (e.g., +61 2 1234 5678 or 02 1234 5678)',
      minLength: 9,
      maxLength: 12
    },
    DE: {
      pattern: /^(\+49|0)[1-9]\d{10,11}$/,
      message: 'Please enter a valid German phone number (e.g., +49 30 12345678)',
      minLength: 11,
      maxLength: 13
    },
    FR: {
      pattern: /^(\+33|0)[1-9]\d{8}$/,
      message: 'Please enter a valid French phone number (e.g., +33 1 23 45 67 89)',
      minLength: 10,
      maxLength: 12
    }
  }

  const countryPattern = phonePatterns[countryCode] || phonePatterns['GB'] // Default to GB
  
  // Check length
  if (cleanPhone.length < countryPattern.minLength || cleanPhone.length > countryPattern.maxLength) {
    return {
      isValid: false,
      error: countryPattern.message
    }
  }

  // Check pattern
  if (!countryPattern.pattern.test(phone)) {
    return {
      isValid: false,
      error: countryPattern.message
    }
  }

  return { isValid: true }
}

// Postal code validation
export const validatePostalCode = (postalCode: string, countryCode: string = 'GB'): ValidationResult => {
  if (!postalCode || postalCode.trim() === '') {
    return {
      isValid: false,
      error: 'Postal code is required'
    }
  }

  const cleanPostalCode = postalCode.trim().toUpperCase()

  // Country-specific postal code patterns
  const postalPatterns: Record<string, { pattern: RegExp; message: string }> = {
    GB: {
      pattern: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/,
      message: 'Please enter a valid UK postcode (e.g., SW1A 1AA or M1 1AA)'
    },
    US: {
      pattern: /^\d{5}(-\d{4})?$/,
      message: 'Please enter a valid US ZIP code (e.g., 12345 or 12345-6789)'
    },
    CA: {
      pattern: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/,
      message: 'Please enter a valid Canadian postal code (e.g., K1A 0A6)'
    },
    AU: {
      pattern: /^\d{4}$/,
      message: 'Please enter a valid Australian postcode (e.g., 2000)'
    },
    DE: {
      pattern: /^\d{5}$/,
      message: 'Please enter a valid German postal code (e.g., 10115)'
    },
    FR: {
      pattern: /^\d{5}$/,
      message: 'Please enter a valid French postal code (e.g., 75001)'
    },
    NL: {
      pattern: /^\d{4}\s?[A-Z]{2}$/,
      message: 'Please enter a valid Dutch postal code (e.g., 1012 AB)'
    },
    IT: {
      pattern: /^\d{5}$/,
      message: 'Please enter a valid Italian postal code (e.g., 00118)'
    },
    ES: {
      pattern: /^\d{5}$/,
      message: 'Please enter a valid Spanish postal code (e.g., 28001)'
    }
  }

  const countryPattern = postalPatterns[countryCode]
  
  if (!countryPattern) {
    // For countries not in our list, just check it's not empty
    return { isValid: true }
  }

  if (!countryPattern.pattern.test(cleanPostalCode)) {
    return {
      isValid: false,
      error: countryPattern.message
    }
  }

  return { isValid: true }
}

// Country code validation
export const validateCountryCode = (countryCode: string): ValidationResult => {
  if (!countryCode || countryCode.trim() === '') {
    return {
      isValid: false,
      error: 'Country is required'
    }
  }

  // List of supported country codes
  const supportedCountries = [
    'GB', 'US', 'CA', 'AU', 'DE', 'FR', 'NL', 'IT', 'ES', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT'
  ]

  if (!supportedCountries.includes(countryCode)) {
    return {
      isValid: false,
      error: 'Please select a supported country for delivery'
    }
  }

  return { isValid: true }
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: 'Email address is required'
    }
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailPattern.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    }
  }

  return { isValid: true }
}

// Name validation
export const validateName = (name: string, fieldName: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`
    }
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: `${fieldName} must be at least 2 characters long`
    }
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const namePattern = /^[a-zA-Z\s\-']+$/
  
  if (!namePattern.test(name)) {
    return {
      isValid: false,
      error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`
    }
  }

  return { isValid: true }
}

// Address validation
export const validateAddress = (address: string): ValidationResult => {
  if (!address || address.trim() === '') {
    return {
      isValid: false,
      error: 'Address is required'
    }
  }

  if (address.trim().length < 5) {
    return {
      isValid: false,
      error: 'Please enter a complete address'
    }
  }

  return { isValid: true }
}

// City validation
export const validateCity = (city: string): ValidationResult => {
  if (!city || city.trim() === '') {
    return {
      isValid: false,
      error: 'City is required'
    }
  }

  if (city.trim().length < 2) {
    return {
      isValid: false,
      error: 'City name must be at least 2 characters long'
    }
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const cityPattern = /^[a-zA-Z\s\-']+$/
  
  if (!cityPattern.test(city)) {
    return {
      isValid: false,
      error: 'City name can only contain letters, spaces, hyphens, and apostrophes'
    }
  }

  return { isValid: true }
}

// Comprehensive address validation
export const validateAddressForm = (address: AddressFormData): Record<string, ValidationResult> => {
  return {
    first_name: validateName(address.first_name, 'First name'),
    last_name: validateName(address.last_name, 'Last name'),
    address_1: validateAddress(address.address_1),
    city: validateCity(address.city),
    country_code: validateCountryCode(address.country_code),
    postal_code: validatePostalCode(address.postal_code, address.country_code),
    phone: validatePhoneNumber(address.phone || '', address.country_code)
  }
}

// Check if address form is valid
export const isAddressFormValid = (address: AddressFormData): boolean => {
  const validationResults = validateAddressForm(address)
  return Object.values(validationResults).every(result => result.isValid)
}