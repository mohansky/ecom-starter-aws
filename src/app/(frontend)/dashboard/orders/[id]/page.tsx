// src/app/(frontend)/dashboard/orders/[id]/page.tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Truck,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import DateFormatter from '@/components/DateFormater'

interface OrderDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const payload = await getPayload({ config })
  const { id } = await params

  try {
    const order = await payload.findByID({
      collection: 'orders',
      id: id,
      depth: 2,
    })

    if (!order) {
      notFound()
    }

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'delivered':
          return CheckCircle2
        case 'shipped':
          return Truck
        case 'processing':
          return Clock
        case 'cancelled':
        case 'refunded':
          return XCircle
        default:
          return AlertCircle
      }
    }

    const getPaymentStatusIcon = (status: string) => {
      switch (status) {
        case 'captured':
          return CheckCircle2
        case 'authorized':
          return Clock
        case 'failed':
        case 'refunded':
          return XCircle
        default:
          return AlertCircle
      }
    }

    const StatusIcon = getStatusIcon(order.status)
    const PaymentIcon = getPaymentStatusIcon(order.payment?.paymentStatus || 'pending')

    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/orders">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Package className="mr-3 h-8 w-8" />
                Order {order.orderNumber}
              </h1>
              <p className="text-muted-foreground mt-1">
                Created on <DateFormatter dateString={order.createdAt} />
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              variant={
                order.status === 'delivered'
                  ? 'success'
                  : order.status === 'shipped'
                    ? 'default'
                    : order.status === 'processing'
                      ? 'secondary'
                      : 'destructive'
              }
              className="text-sm px-3 py-1"
            >
              <StatusIcon className="mr-1 h-4 w-4" />
              {order.status}
            </Badge>
            <Badge
              variant={
                order.payment?.paymentStatus === 'captured'
                  ? 'success'
                  : order.payment?.paymentStatus === 'authorized'
                    ? 'default'
                    : 'destructive'
              }
              className="text-sm px-3 py-1"
            >
              <PaymentIcon className="mr-1 h-4 w-4" />
              {order.payment?.paymentStatus || 'pending'}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-start p-4 border rounded-lg bg-gray-50"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {typeof item.product === 'object' ? item.product.title : item.product}
                          </h4>
                          <div className="text-sm text-muted-foreground mt-1">
                            Quantity: {item.quantity} × ₹{item.price?.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{item.total?.toFixed(2)}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">No items found</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="mr-3 h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {order.customer?.firstName} {order.customer?.lastName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">{order.customer?.email}</div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-3 h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">{order.customer?.phone || '-'}</div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shipping && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        Shipping Address
                      </h4>
                      <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                        {order.shipping.address1}
                        <br />
                        {order.shipping.address2 && (
                          <>
                            {order.shipping.address2}
                            <br />
                          </>
                        )}
                        {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}
                        <br />
                        {order.shipping.country}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Order Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">{order.notes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Summary & Payment */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{order.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{order.tax?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>₹{order.shipping_cost?.toFixed(2)}</span>
                  </div>
                  {order.discount && order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-₹{order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>₹{order.total?.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Method:</span>
                    <Badge variant="outline">{order.paymentMethod}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge
                      variant={
                        order.payment?.paymentStatus === 'captured'
                          ? 'success'
                          : order.payment?.paymentStatus === 'authorized'
                            ? 'default'
                            : 'destructive'
                      }
                    >
                      {order.payment?.paymentStatus || 'pending'}
                    </Badge>
                  </div>
                  {order.payment?.razorpayPaymentId && (
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Payment ID:</span>
                        <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                          {order.payment.razorpayPaymentId}
                        </div>
                      </div>
                    </div>
                  )}
                  {order.payment?.razorpayOrderId && (
                    <div>
                      <span className="text-sm font-medium">Order ID:</span>
                      <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                        {order.payment.razorpayOrderId}
                      </div>
                    </div>
                  )}
                  {order.payment?.paymentDate && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Payment Date:</span>
                      <span className="text-sm">
                        <DateFormatter dateString={order.payment.paymentDate} />
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Created:</span>
                    <span className="text-sm">
                      <DateFormatter dateString={order.createdAt} />
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Updated:</span>
                    <span className="text-sm">
                      <DateFormatter dateString={order.updatedAt} />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching order:', error)
    notFound()
  }
}
