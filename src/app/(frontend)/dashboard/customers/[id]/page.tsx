// src/app/(frontend)/dashboard/customers/[id]/page.tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  CheckCircle2,
  XCircle,
  Package,
  Hash,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import DateFormatter from '@/components/DateFormater'
import CustomDataTable from '@/components/DataTable/CustomDataTable'
import { OrdersColumns } from '@/components/DataTable/Columns/OrdersColumn'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Heading } from '@/components/Heading'

interface CustomerDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CustomerDetailsPage({ params }: CustomerDetailsPageProps) {
  const payload = await getPayload({ config })
  const { id } = await params

  try {
    const customer = await payload.findByID({
      collection: 'customers',
      id: id,
      depth: 2,
    })

    if (!customer) {
      notFound()
    }

    // Fetch customer's orders
    const customerOrders = await payload.find({
      collection: 'orders',
      where: {
        'customer.email': {
          equals: customer.email,
        },
      },
      limit: 100,
      sort: '-createdAt',
      depth: 2,
    })

    const avgOrderValue =
      customer.totalOrders && customer.totalOrders > 0
        ? (customer.totalSpent || 0) / customer.totalOrders
        : 0

    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar className="rounded-full w-10 h-10">
                <AvatarFallback>
                  {customer.firstName?.[0]}
                  {customer.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="flex items-center gap-3">
                  <Heading size="sm" className="mb-1">
                    {customer.firstName} {customer.lastName}
                  </Heading>
                  <Badge variant={customer.status === 'active' ? 'success' : 'secondary'}>
                    {customer.status === 'active' ? (
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                    ) : (
                      <XCircle className="mr-1 h-4 w-4" />
                    )}
                    {customer.status || 'active'}
                  </Badge>
                </span>

                <div className="flex justify-between items-center w-1/2">
                  <span className="flex items-center text-sm font-medium">
                    <Hash className="mr-1 h-3 w-3" />
                    Customer ID
                  </span>
                  <span>{customer.id}</span>
                </div>

                <Heading size="xxs" fontweight="light" className="mt-1">
                  Customer since <DateFormatter dateString={customer.createdAt} />
                </Heading>
              </div>
            </div>
          </div>
          <Link href="/dashboard/customers">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Customers
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Customer Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                        <div className="font-medium">
                          {customer.firstName} {customer.lastName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Email</div>
                        <div className="font-medium">{customer.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Phone</div>
                        <div className="font-medium">{customer.phone || 'Not provided'}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Member Since
                        </div>
                        <div className="font-medium">
                          <DateFormatter dateString={customer.createdAt} />
                        </div>
                      </div>
                    </div>
                    {customer.lastOrderDate && (
                      <div className="flex items-center space-x-3">
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">
                            Last Order
                          </div>
                          <div className="font-medium">
                            <DateFormatter dateString={customer.lastOrderDate} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Status</div>
                        <Badge variant={customer.status === 'active' ? 'success' : 'secondary'}>
                          {customer.status || 'active'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Addresses */}
            {customer.addresses && customer.addresses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Addresses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {customer.addresses.map((address, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={address.type === 'shipping' ? 'default' : 'secondary'}>
                            {address.type}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          {address.address1}
                          <br />
                          {address.address2 && (
                            <>
                              {address.address2}
                              <br />
                            </>
                          )}
                          {address.city}, {address.state} {address.postalCode}
                          <br />
                          {address.country}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Customer Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Order History ({customerOrders.totalDocs} orders)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {customerOrders.docs.length > 0 ? (
                  <CustomDataTable
                    columns={OrdersColumns}
                    data={customerOrders.docs}
                    pgSize={5}
                    tableTitle=""
                    showDatePicker
                    dateField="createdAt"
                    filters={[
                      { column: 'orderNumber', placeholder: 'Find by Order Number' },
                      { column: 'status', placeholder: 'Find by Status' },
                    ]}
                  />
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No orders yet</h3>
                    <p>This customer hasn&apos;t placed any orders.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Statistics & Info */}
          <div className="space-y-6">
            {/* Customer ID */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Hash className="mr-2 h-5 w-5" />
                  Customer ID
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-sm bg-gray-100 p-3 rounded">{customer.id}</div>
              </CardContent>
            </Card> */}

            {/* Order Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Order Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {customer.totalOrders || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Orders</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      ₹{customer.totalSpent?.toFixed(2) || '0.00'}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">
                      ₹{avgOrderValue.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Order Value</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    Create Order
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Edit Customer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Customer Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Customer Type:</span>
                    <Badge variant="outline">
                      {(customer.totalOrders || 0) > 5
                        ? 'VIP'
                        : (customer.totalOrders || 0) > 1
                          ? 'Regular'
                          : 'New'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Orders This Month:</span>
                    <span className="text-sm font-medium">
                      {
                        customerOrders.docs.filter((order) => {
                          const orderDate = new Date(order.createdAt)
                          const now = new Date()
                          return (
                            orderDate.getMonth() === now.getMonth() &&
                            orderDate.getFullYear() === now.getFullYear()
                          )
                        }).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Preferred Payment:</span>
                    <span className="text-sm font-medium">
                      {customerOrders.docs.length > 0
                        ? customerOrders.docs[0].paymentMethod
                        : 'Not available'}
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
    console.error('Error fetching customer:', error)
    notFound()
  }
}
