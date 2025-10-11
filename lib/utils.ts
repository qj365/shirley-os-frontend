import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format price with currency symbol
export function formatCurrency(amount: number | undefined, currencyCode: string = "GBP"): string {
  if (amount === undefined) return "£0.00"
  
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currencyCode,
  }).format(amount)
}