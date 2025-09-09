// src/hooks/useCartRecovery.ts
'use client'
import type { CartItem } from '@/types'

interface CheckoutRecoveryData {
  cart: {
    items: CartItem[]
    totalItems: number
    totalPrice: number
  }
  customerInfo: {
    name: string
    email: string
    phone: string
    address: {
      line1: string
      line2: string
      city: string
      state: string
      postal_code: string
      country: string
    }
  }
  timestamp: number
}

export const useCartRecovery = () => {
  const recoverCheckoutData = (): CheckoutRecoveryData | null => {
    if (typeof window === 'undefined') return null
    
    try {
      const recoveryData = localStorage.getItem('checkout_recovery')
      if (!recoveryData) return null

      const data: CheckoutRecoveryData = JSON.parse(recoveryData)
      
      // Check if data is not too old (24 hours)
      const twentyFourHours = 24 * 60 * 60 * 1000
      if (Date.now() - data.timestamp > twentyFourHours) {
        localStorage.removeItem('checkout_recovery')
        return null
      }

      return data
    } catch (error) {
      console.error('Error recovering checkout data:', error)
      localStorage.removeItem('checkout_recovery')
      return null
    }
  }

  const clearRecoveryData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('checkout_recovery')
    }
  }

  const hasRecoveryData = (): boolean => {
    const data = recoverCheckoutData()
    return data !== null && data.cart.items.length > 0
  }

  return {
    recoverCheckoutData,
    clearRecoveryData,
    hasRecoveryData
  }
}