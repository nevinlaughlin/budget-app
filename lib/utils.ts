import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const currencyFormatter = new Intl.NumberFormat(undefined, {
  currency: "usd",
  style: "currency",
  minimumFractionDigits: 0,
})

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC', // Ensure consistent formatting regardless of user's timezone
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
})
