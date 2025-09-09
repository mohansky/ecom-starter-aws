'use client'
// src/components/CheckoutForm.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useShoppingCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/formatHelpers'
import type { Cart } from '@/types'

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

interface RazorpayInstance {
  open(): void
  on(event: string, handler: (response: unknown) => void): void
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface CheckoutFormProps {
  cart: Cart
}

interface CustomerInfo {
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

export function CheckoutForm({ cart }: CheckoutFormProps) {
  const { clearCart } = useShoppingCart()
  const [loading, setLoading] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
    },
  })

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1]
      setCustomerInfo((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }))
    } else {
      setCustomerInfo((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const validateForm = () => {
    const { name, email, phone, address } = customerInfo
    return (
      name &&
      email &&
      phone &&
      address.line1 &&
      address.city &&
      address.state &&
      address.postal_code
    )
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    if (!validateForm()) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)

    // Save cart and customer info for recovery in case of failure
    const checkoutData = {
      cart,
      customerInfo,
      timestamp: Date.now()
    }
    localStorage.setItem('checkout_recovery', JSON.stringify(checkoutData))

    try {
      // Load Razorpay script
      const res = await loadRazorpayScript()
      if (!res) {
        alert('Razorpay SDK failed to load. Please check your internet connection.')
        setLoading(false)
        return
      }

      // Create order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: cart.totalPrice,
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          notes: {
            customer_name: customerInfo.name,
            customer_email: customerInfo.email,
            customer_phone: customerInfo.phone,
          },
          cartDetails: cart,
        }),
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create order')
      }

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // Configure Razorpay options
      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Your Store Name',
        description: `Order for ${cart.totalItems} items`,
        order_id: orderData.order.id,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cartDetails: cart,
                customerDetails: {
                  email: customerInfo.email,
                  firstName: customerInfo.name.split(' ')[0] || customerInfo.name,
                  lastName: customerInfo.name.split(' ').slice(1).join(' ') || '',
                  phone: customerInfo.phone,
                },
                shippingAddress: {
                  address1: customerInfo.address.line1,
                  address2: customerInfo.address.line2,
                  city: customerInfo.address.city,
                  state: customerInfo.address.state,
                  postalCode: customerInfo.address.postal_code,
                  country: customerInfo.address.country,
                },
                billingAddress: {
                  sameAsShipping: true,
                },
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              // Payment successful - clear cart and recovery data
              clearCart()
              localStorage.removeItem('checkout_recovery')
              // Redirect to success page with order ID
              window.location.href = `/order-success?orderId=${verifyData.order.id}`
            } else {
              alert('Payment verification failed: ' + verifyData.error)
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            alert('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        notes: {
          address: `${customerInfo.address.line1}, ${customerInfo.address.city}, ${customerInfo.address.state} ${customerInfo.address.postal_code}`,
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
        retry: {
          enabled: true,
          max_count: 3
        },
        timeout: 300, // 5 minutes timeout
        remember_customer: false,
      }

      // Override modal dismiss handler
      options.modal = {
        ondismiss: () => {
          setLoading(false)
          // Payment was dismissed/cancelled
          console.log('Payment cancelled by user')
        }
      }

      // Open Razorpay checkout
      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
      setLoading(false)
    } catch (error) {
      console.error('Payment error:', error)
      setLoading(false)
      
      // Extract error information
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      // Redirect to payment failed page
      const params = new URLSearchParams({
        error: 'GATEWAY_ERROR',
        message: errorMessage,
        amount: cart.totalPrice.toString()
      })
      
      window.location.href = `/payment-failed?${params.toString()}`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={customerInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+91 9876543210"
            required
          />
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="font-medium">Shipping Address</h3>

          <div>
            <Label htmlFor="address-line1">Address Line 1 *</Label>
            <Input
              id="address-line1"
              value={customerInfo.address.line1}
              onChange={(e) => handleInputChange('address.line1', e.target.value)}
              placeholder="Street address"
              required
            />
          </div>

          <div>
            <Label htmlFor="address-line2">Address Line 2</Label>
            <Input
              id="address-line2"
              value={customerInfo.address.line2}
              onChange={(e) => handleInputChange('address.line2', e.target.value)}
              placeholder="Apartment, suite, etc. (optional)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={customerInfo.address.city}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                placeholder="Mumbai"
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={customerInfo.address.state}
                onChange={(e) => handleInputChange('address.state', e.target.value)}
                placeholder="Maharashtra"
                required
              />
            </div>
            <div>
              <Label htmlFor="postal-code">Postal Code *</Label>
              <Input
                id="postal-code"
                value={customerInfo.address.postal_code}
                onChange={(e) => handleInputChange('address.postal_code', e.target.value)}
                placeholder="400001"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={customerInfo.address.country}
              onChange={(e) => handleInputChange('address.country', e.target.value)}
              placeholder="India"
              required
            />
          </div>
        </div>

        {/* Payment Button */}
        <div className="pt-6 border-t">
          <Button
            onClick={handlePayment}
            disabled={loading || !validateForm()}
            className="w-full"
            size="lg"
          >
            {loading ? 'Processing...' : `Pay ${formatPrice(cart.totalPrice)}`}
          </Button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Secure payment powered by Razorpay
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
