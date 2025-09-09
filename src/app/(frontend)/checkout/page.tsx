'use client'

import { useShoppingCart } from '@/contexts/CartContext'
import { CheckoutForm } from '@/components/CheckoutForm'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/formatHelpers'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart } from 'lucide-react'

export default function CheckoutPage() {
  const { cart } = useShoppingCart()

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h1>
            <p className="mt-2 text-gray-600">
              Add some products to your cart before proceeding to checkout.
            </p>
            <Link href="/products">
              <Button className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="lg:order-2">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.title}
                      </h3>
                      {item.variants.length > 0 && (
                        <div className="mt-1 text-xs text-gray-500">
                          {item.variants.map(variant => 
                            `${variant.name}: ${variant.value}`
                          ).join(', ')}
                        </div>
                      )}
                      <div className="mt-1 flex items-center text-sm">
                        <span className="text-gray-600">Qty: {item.quantity}</span>
                        <span className="mx-2 text-gray-400">×</span>
                        <span className="font-medium text-gray-900">
                          {formatPrice(item.basePrice)}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cart.totalItems} items)</span>
                  <span className="text-gray-900">{formatPrice(cart.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">Calculated at next step</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-base font-medium">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatPrice(cart.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:order-1">
            <CheckoutForm cart={cart} />
          </div>
        </div>
      </div>
    </div>
  )
}