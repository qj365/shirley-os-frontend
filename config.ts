import Medusa from "@medusajs/js-sdk"

// FastAPI Backend Configuration
export const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://141.95.145.120:8081"

// Stripe Configuration
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""

// Medusa SDK Configuration (for cart and auth services)
let MEDUSA_BACKEND_URL = "http://141.95.145.120:9000"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  auth: {
    type: "jwt",
    jwtTokenStorageKey: "shirleys_auth_token",
    jwtTokenStorageMethod: "local", // Use localStorage for persistent storage
  },
})

