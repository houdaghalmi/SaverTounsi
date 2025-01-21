// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistance, format } from "date-fns"
import { ar, fr } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency in TND
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ar-TN", {
    style: "currency",
    currency: "TND",
  }).format(amount)
}

// Format date based on locale
export function formatDate(date: Date, locale: string = "fr"): string {
  const locales = {
    ar,
    fr,
  }
  
  return format(date, "PP", {
    locale: locales[locale as keyof typeof locales],
  })
}

// Get relative time
export function getRelativeTime(date: Date, locale: string = "fr"): string {
  const locales = {
    ar,
    fr,
  }
  
  return formatDistance(date, new Date(), {
    addSuffix: true,
    locale: locales[locale as keyof typeof locales],
  })
}

// Validate email
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Generate avatar URL from name
export function getAvatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random`
}