'use client'
// src/contexts/CartContext.tsx
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import type { Cart, CartItem, CartVariant, CartContextType } from '@/types'
import type { Product } from '@/payload-types'

const CartContext = createContext<CartContextType | undefined>(undefined)

type CartAction =
  | {
      type: 'ADD_TO_CART'
      payload: { product: Product; variants: CartVariant[]; quantity: number }
    }
  | { type: 'REMOVE_FROM_CART'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: { cart: Cart } }

const generateItemId = (productId: string | number, variants: CartVariant[]): string => {
  const variantString = variants
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((v) => `${v.name}:${v.value}`)
    .join('|')
  return `${productId}-${variantString}`
}

const calculateItemPrice = (product: Product, variants: CartVariant[]): number => {
  const basePrice = product.price
  const variantPriceModifier = variants.reduce((total, variant) => total + variant.priceModifier, 0)
  return basePrice + variantPriceModifier
}

const calculateTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = items.reduce((total, item) => total + item.totalPrice, 0)
  return { totalItems, totalPrice }
}

const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, variants, quantity } = action.payload
      const itemId = generateItemId(product.id, variants)
      const basePrice = calculateItemPrice(product, variants)

      const existingItemIndex = state.items.findIndex((item) => item.id === itemId)

      let newItems: CartItem[]

      if (existingItemIndex >= 0) {
        newItems = [...state.items]
        const existingItem = newItems[existingItemIndex]
        const newQuantity = existingItem.quantity + quantity
        newItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: basePrice * newQuantity,
        }
      } else {
        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          product,
          variants,
          quantity,
          basePrice,
          totalPrice: basePrice * quantity,
        }
        newItems = [...state.items, newItem]
      }

      const { totalItems, totalPrice } = calculateTotals(newItems)

      return {
        items: newItems,
        totalItems,
        totalPrice,
      }
    }

    case 'REMOVE_FROM_CART': {
      const { itemId } = action.payload
      const newItems = state.items.filter((item) => item.id !== itemId)
      const { totalItems, totalPrice } = calculateTotals(newItems)

      return {
        items: newItems,
        totalItems,
        totalPrice,
      }
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload

      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: { itemId } })
      }

      const newItems = state.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            totalPrice: item.basePrice * quantity,
          }
        }
        return item
      })

      const { totalItems, totalPrice } = calculateTotals(newItems)

      return {
        items: newItems,
        totalItems,
        totalPrice,
      }
    }

    case 'CLEAR_CART': {
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      }
    }

    case 'LOAD_CART': {
      return action.payload.cart
    }

    default:
      return state
  }
}

const initialCart: Cart = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart)

  useEffect(() => {
    const savedCart = localStorage.getItem('shopping-cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as Cart
        dispatch({ type: 'LOAD_CART', payload: { cart: parsedCart } })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('shopping-cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product, variants: CartVariant[], quantity: number = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, variants, quantity } })
  }

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { itemId } })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const isInCart = (productId: string | number, variants: CartVariant[]): boolean => {
    const itemId = generateItemId(productId, variants)
    return cart.items.some((item) => item.id === itemId)
  }

  const getCartItem = (
    productId: string | number,
    variants: CartVariant[],
  ): CartItem | undefined => {
    const itemId = generateItemId(productId, variants)
    return cart.items.find((item) => item.id === itemId)
  }

  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItem,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export const useShoppingCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useShoppingCart must be used within a CartProvider')
  }
  return context
}
