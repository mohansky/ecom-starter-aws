// src/types/index.ts
import type { Product } from '@/payload-types'

export interface CartVariant {
  name: string
  value: string
  priceModifier: number
  quantity?: number | null
  weight?: number | null
  dimensions?: {
    length?: number | null
    width?: number | null
    height?: number | null
  } | null
  sku?: string | null
}

export interface CartItem {
  id: string
  productId: string | number
  product: Product
  variants: CartVariant[]
  quantity: number
  basePrice: number
  totalPrice: number
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

export interface CartContextType {
  cart: Cart
  addToCart: (product: Product, variants: CartVariant[], quantity?: number) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: string | number, variants: CartVariant[]) => boolean
  getCartItem: (productId: string | number, variants: CartVariant[]) => CartItem | undefined
}

// Helper functions to calculate effective properties
export const getEffectiveQuantity = (product: Product, variants: CartVariant[]): number | null => {
  // Find if any variant has a specific quantity
  for (const variant of variants) {
    if (variant.quantity !== undefined && variant.quantity !== null) {
      return variant.quantity
    }
  }
  return product.quantity || null
}

export const getEffectiveWeight = (product: Product, variants: CartVariant[]): number | null => {
  // Find if any variant has a specific weight
  for (const variant of variants) {
    if (variant.weight !== undefined && variant.weight !== null) {
      return variant.weight
    }
  }
  return product.weight || null
}

export const getEffectiveDimensions = (product: Product, variants: CartVariant[]) => {
  // Find if any variant has specific dimensions
  for (const variant of variants) {
    if (
      variant.dimensions &&
      (variant.dimensions.length || variant.dimensions.width || variant.dimensions.height)
    ) {
      return {
        length: variant.dimensions.length || product.dimensions?.length || null,
        width: variant.dimensions.width || product.dimensions?.width || null,
        height: variant.dimensions.height || product.dimensions?.height || null,
      }
    }
  }
  return product.dimensions || null
}

export const getEffectiveSku = (product: Product, variants: CartVariant[]): string | null => {
  // Find if any variant has a specific SKU
  for (const variant of variants) {
    if (variant.sku) {
      return variant.sku
    }
  }
  return product.sku || null
}
