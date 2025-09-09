// src/lib/formatHelpers.ts

/**
 * Format a numeric price value to INR currency format
 * @param price - The price value to format
 * @param options - Optional Intl.NumberFormat options to override defaults
 * @returns Formatted price string in INR
 */
export function formatPrice(price: number, options: Intl.NumberFormatOptions = {}): string {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'INR',
    ...options,
  }

  return new Intl.NumberFormat('en-IN', defaultOptions).format(price)
}

/**
 * Format price without currency symbol (just the number)
 * @param price - The price value to format
 * @returns Formatted price number string
 */
export function formatPriceNumber(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

export const formatRupees = (paisa: number) => {
  return paisa?.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  })
}

export const formatPaisa = (paisa: number) => {
  return (paisa / 100)?.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  })
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
