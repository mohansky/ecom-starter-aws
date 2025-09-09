'use client'
// src/components/DataTable/Columns/OrdersColumns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Hash,
  ArrowUpDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Order } from '@/payload-types'
import Link from 'next/link'
import DateFormatter from '@/components/DateFormater'
import { OrderStatusEditor } from '@/components/OrderStatusEditor'

export const OrdersColumns: ColumnDef<Order>[] = [
  {
    accessorKey: 'orderNumber',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-32"
        >
          Order #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const orderNumber = row.getValue('orderNumber') as string
      const orderId = row.original.id
      return (
        <Link href={`/dashboard/orders/${orderId}`} title={`View Order ${orderNumber}`}>
          <Button variant="link" size="sm">
            {orderNumber}
          </Button>
        </Link>
      )
    },
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
      const customer = row.getValue('customer') as Order['customer']
      return (
        <div className="min-w-[180px]">
          <div className="font-medium">
            {customer?.firstName} {customer?.lastName}
          </div>
          <div className="text-sm text-muted-foreground">{customer?.email}</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'payment.paymentStatus',
    header: 'Payment',
    cell: ({ row }) => {
      const payment = row.original.payment
      const paymentStatus = payment?.paymentStatus || 'pending'
      const statusConfig = {
        pending: { variant: 'secondary' as const, label: 'Pending', icon: Clock },
        authorized: { variant: 'default' as const, label: 'Authorized', icon: CheckCircle2 },
        captured: { variant: 'success' as const, label: 'Captured', icon: CheckCircle2 },
        failed: { variant: 'destructive' as const, label: 'Failed', icon: XCircle },
        refunded: { variant: 'destructive' as const, label: 'Refunded', icon: XCircle },
      }
      const config =
        statusConfig[paymentStatus as keyof typeof statusConfig] || statusConfig.pending
      const IconComponent = config.icon

      return (
        <div className="flex items-center gap-2">
          <Badge variant={config.variant} className="capitalize">
            <IconComponent className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Order Status',
    cell: ({ row }) => {
      const order = row.original
      const orderStatus = row.getValue('status') as string

      return (
        <OrderStatusEditor
          orderId={order.id}
          currentStatus={orderStatus}
          orderNumber={order.orderNumber}
        />
      )
    },
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Payment Method',
    cell: ({ row }) => {
      const paymentMethod = row.getValue('paymentMethod') as string
      const methodConfig = {
        razorpay: { variant: 'default' as const, label: 'Razorpay', icon: CreditCard },
        credit_card: { variant: 'default' as const, label: 'Credit Card', icon: CreditCard },
        cod: { variant: 'secondary' as const, label: 'Cash on Delivery', icon: Package },
      }
      const config =
        methodConfig[paymentMethod as keyof typeof methodConfig] || methodConfig.razorpay
      const IconComponent = config.icon

      return (
        <Badge variant={config.variant} className="capitalize">
          <IconComponent className="mr-1 h-3 w-3" />
          {config.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'total',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = row.getValue('total') as number
      const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(amount)

      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <DateFormatter dateString={row.getValue('createdAt')} />,
  },
  {
    id: 'details',
    header: 'Details',
    cell: ({ row }) => {
      const order = row.original
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Order Details - {order.orderNumber}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Payment & Status Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-2">
                    <Hash className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Order ID:</span>
                    <span className="ml-2 text-gray-600">{order.orderNumber}</span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Payment:</span>
                      <Badge
                        variant={
                          order.payment?.paymentStatus === 'captured'
                            ? 'success'
                            : order.payment?.paymentStatus === 'failed'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className="ml-2 capitalize"
                      >
                        {order.payment?.paymentStatus || 'pending'}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Status:</span>
                      <Badge className="ml-2 capitalize">{order.status}</Badge>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Payment Method:</span>
                      <Badge className="ml-2 capitalize">{order.paymentMethod}</Badge>
                    </div>
                  </div>

                  {order.payment?.razorpayPaymentId && (
                    <div className="mt-4 flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Payment ID:</span>
                      <span className="ml-2 font-mono text-sm">
                        {order.payment.razorpayPaymentId}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Name:</span>
                      <span className="ml-2">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Email:</span>
                      <span className="ml-2 text-sm">{order.customer?.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2">{order.customer?.phone}</span>
                    </div>
                    {order.shipping && (
                      <div className="flex items-start">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="font-medium">Shipping Address:</span>
                        <span className="ml-2 text-sm">
                          {order.shipping.address1},{' '}
                          {order.shipping.address2 && `${order.shipping.address2}, `}
                          {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode},{' '}
                          {order.shipping.country}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium">
                              {typeof item.product === 'object' ? item.product.title : item.product}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Qty: {item.quantity} × ₹{item.price?.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">₹{item.total?.toFixed(2)}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-4">No items found</div>
                    )}

                    <Separator />

                    <div className="space-y-2">
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
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total:</span>
                        <span>₹{order.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dates & Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Created:</span>
                      <span className="ml-2 text-sm">
                        <DateFormatter dateString={order.createdAt} />
                      </span>
                    </div>

                    {order.payment?.paymentDate && (
                      <div className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                        <span className="font-medium">Payment Date:</span>
                        <span className="ml-2 text-sm">
                          <DateFormatter dateString={order.payment.paymentDate} />
                        </span>
                      </div>
                    )}

                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Last Updated:</span>
                      <span className="ml-2 text-sm">
                        <DateFormatter dateString={order.updatedAt} />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {order.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-sm">Order Notes:</span>
                        <p className="text-sm mt-1 p-2 bg-muted rounded">{order.notes}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Order ID */}
              <div className="pt-2 border-t flex items-center justify-center">
                <span className="font-light text-sm text-muted-foreground">
                  Order ID: {order.id}
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )
    },
  },
]
