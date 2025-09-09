'use client'
// src/components/DataTable/Columns/CustomersColumns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  Users,
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
import { Customer } from '@/payload-types'
import Link from 'next/link'
import DateFormatter from '@/components/DateFormater'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const CustomersColumns: ColumnDef<Customer>[] = [
  // Hidden column for firstName filtering
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: ({ row }) => row.getValue('firstName'),
    enableHiding: true,
  },
  // Hidden column for lastName filtering
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    cell: ({ row }) => row.getValue('lastName'),
    enableHiding: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-48"
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const customer = row.original
      return (
        <div className="min-w-[200px]">
          <Link href={`/dashboard/customers/${customer.id}`} title="View Customer Details">
            <div className="flex items-center">
              <Avatar className="bg-primary rounded-full w-10 h-10">
                <AvatarFallback>
                  {customer.firstName?.[0]}
                  {customer.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <div className="font-medium text-gray-900">
                  {customer.firstName} {customer.lastName}
                </div>
                <div className="text-sm text-muted-foreground">{customer.email}</div>
              </div>
            </div>
          </Link>
        </div>
      )
    },
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string
      return (
        <div className="flex items-center">
          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{phone || '-'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'totalOrders',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Orders
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const totalOrders = row.getValue('totalOrders') as number
      return (
        <div className="flex items-center">
          <ShoppingBag className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{totalOrders || 0}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'totalSpent',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total Spent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = row.getValue('totalSpent') as number
      const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(amount || 0)

      return (
        <div className="flex items-center">
          <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{formatted}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'lastOrderDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Last Order
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const lastOrderDate = row.getValue('lastOrderDate') as string
      return (
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {lastOrderDate ? <DateFormatter dateString={lastOrderDate} /> : '-'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const statusConfig = {
        active: { variant: 'success' as const, label: 'Active', icon: CheckCircle2 },
        inactive: { variant: 'secondary' as const, label: 'Inactive', icon: XCircle },
      }
      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
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
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Joined
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
      const customer = row.original
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
                <Users className="mr-2 h-5 w-5" />
                Customer Details - {customer.firstName} {customer.lastName}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Name:</span>
                      <span className="ml-2">
                        {customer.firstName} {customer.lastName}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Email:</span>
                      <span className="ml-2 text-sm">{customer.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2">{customer.phone || '-'}</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Status:</span>
                      <Badge
                        variant={customer.status === 'active' ? 'success' : 'secondary'}
                        className="ml-2 capitalize"
                      >
                        {customer.status || 'active'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Order Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {customer.totalOrders || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Orders</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{customer.totalSpent?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Spent</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        ₹
                        {customer.totalOrders && customer.totalOrders > 0
                          ? ((customer.totalSpent || 0) / customer.totalOrders).toFixed(2)
                          : '0.00'}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Order Value</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Addresses */}
              {customer.addresses && customer.addresses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <MapPin className="mr-2 h-5 w-5" />
                      Addresses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {customer.addresses.map((address, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center mb-2">
                            <Badge variant={address.type === 'shipping' ? 'default' : 'secondary'}>
                              {address.type}
                            </Badge>
                          </div>
                          <div className="text-sm">
                            {address.address1}
                            {address.address2 && <span>, {address.address2}</span>}
                            <br />
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

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Joined:</span>
                      <span className="ml-2 text-sm">
                        <DateFormatter dateString={customer.createdAt} />
                      </span>
                    </div>

                    {customer.lastOrderDate && (
                      <div className="flex items-center">
                        <ShoppingBag className="mr-2 h-4 w-4 text-green-600" />
                        <span className="font-medium">Last Order:</span>
                        <span className="ml-2 text-sm">
                          <DateFormatter dateString={customer.lastOrderDate} />
                        </span>
                      </div>
                    )}

                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Last Updated:</span>
                      <span className="ml-2 text-sm">
                        <DateFormatter dateString={customer.updatedAt} />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer ID */}
              <div className="pt-2 border-t flex items-center justify-center">
                <span className="font-light text-sm text-muted-foreground">
                  Customer ID: {customer.id}
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )
    },
  },
]
