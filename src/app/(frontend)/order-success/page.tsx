// src/app/(frontend)/order-success/page.tsx
'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin, 
  CreditCard,
  Hash,
  User,
  Mail,
  Phone,
  Home,
  ShoppingBag
} from 'lucide-react'
import Link from 'next/link'
import { formatRupees } from '@/lib/formatHelpers'
import DateFormatter from '@/components/DateFormater'

interface OrderDetails {
  id: string
  orderNumber: string
  status: string
  total: number
  customer: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  items: Array<{
    product: {
      id: string
      title: string
      slug: string
    }
    quantity: number
    price: number
    total: number
  }>
  shipping: {
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  payment: {
    razorpayPaymentId: string
    paymentStatus: string
    paymentMethod: string
    paymentDate: string
    amount: number
  }
  subtotal: number
  tax: number
  shipping_cost: number
  discount: number
  createdAt: string
}

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const orderId = searchParams?.get('orderId')

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId)
    } else {
      setError('No order ID provided')
      setLoading(false)
    }
  }, [orderId])

  const fetchOrderDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch order details')
      }
      const data = await response.json()
      setOrderDetails(data)
    } catch (err) {
      setError('Failed to load order details')
      console.error('Error fetching order details:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !orderDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-red-500 mb-4">
                <Package className="h-12 w-12 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
              <p className="text-muted-foreground mb-4">
                {error || 'We couldn\'t find the order details you\'re looking for.'}
              </p>
              <Button asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'default'
      case 'shipped':
        return 'secondary'
      case 'delivered':
        return 'success'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Header */}
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-green-500 mb-4">
              <CheckCircle className="h-16 w-16 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-xl text-muted-foreground mb-4">
              Thank you for your order, {orderDetails.customer.firstName}!
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Hash className="h-4 w-4" />
              <span className="font-medium">Order #{orderDetails.orderNumber}</span>
            </div>
            <Badge variant={getStatusColor(orderDetails.status)} className="text-sm">
              {orderDetails.status}
            </Badge>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × {formatRupees(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatRupees(item.total)}</p>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatRupees(orderDetails.subtotal)}</span>
                </div>
                {orderDetails.tax > 0 && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatRupees(orderDetails.tax)}</span>
                  </div>
                )}
                {orderDetails.shipping_cost > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{formatRupees(orderDetails.shipping_cost)}</span>
                  </div>
                )}
                {orderDetails.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-{formatRupees(orderDetails.discount)}</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>{formatRupees(orderDetails.total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer & Shipping Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{orderDetails.customer.firstName} {orderDetails.customer.lastName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{orderDetails.customer.email}</span>
                </div>
                {orderDetails.customer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{orderDetails.customer.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p>{orderDetails.shipping.address1}</p>
                  {orderDetails.shipping.address2 && (
                    <p>{orderDetails.shipping.address2}</p>
                  )}
                  <p>
                    {orderDetails.shipping.city}, {orderDetails.shipping.state} {orderDetails.shipping.postalCode}
                  </p>
                  <p>{orderDetails.shipping.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Payment ID:</span>
                  <span className="text-sm font-mono">{orderDetails.payment.razorpayPaymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Status:</span>
                  <Badge variant="success" className="text-xs">
                    {orderDetails.payment.paymentStatus}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Method:</span>
                  <span className="text-sm capitalize">{orderDetails.payment.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Date:</span>
                  <span className="text-sm">
                    <DateFormatter dateString={orderDetails.payment.paymentDate} />
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              What&apos;s Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Order Processing</h4>
                <p className="text-muted-foreground">
                  We&apos;re preparing your order for shipment. You&apos;ll receive a tracking number once your order ships.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Email Confirmation</h4>
                <p className="text-muted-foreground">
                  A confirmation email with your order details has been sent to {orderDetails.customer.email}.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/orders/${orderDetails.id}`}>
              <Package className="mr-2 h-4 w-4" />
              Track Order
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}