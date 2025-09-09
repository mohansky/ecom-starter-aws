// src/app/(frontend)/dashboard/page.tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import { OrdersColumns } from '@/components/DataTable/Columns/OrdersColumn'
import CustomDataTable from '@/components/DataTable/CustomDataTable'
import { Heading } from '@/components/Heading'
import { SalesChart } from '@/components/SalesChart'
import { CategoryPieChart } from '@/components/CategoryPieChart'
import { ProductsPieChart } from '@/components/ProductsPieChart'

export default async function DashboardPage() {
  const payload = await getPayload({ config })

  const [_ordersCount, _customersCount, recentOrders, allOrders] = await Promise.all([
    payload.count({ collection: 'orders' }),
    payload.count({ collection: 'customers' }),
    payload.find({
      collection: 'orders',
      limit: 5,
      sort: '-createdAt',
    }),
    payload.find({
      collection: 'orders',
      limit: 1000,
      sort: '-createdAt',
      where: {
        status: {
          not_equals: 'cancelled',
        },
      },
      depth: 2,
    }),
  ])

  return (
    <div className="space-y-6">
      <Heading size="md" className="mb-5">
        Dashboard Overview
      </Heading>

      {/* Sales Chart */}
      <SalesChart orders={allOrders.docs} />

      {/* Pie Charts - Side by side on large screens, stacked on mobile */}
      <div className="grid lg:grid-cols-2 gap-6">
        <CategoryPieChart orders={allOrders.docs} />
        <ProductsPieChart orders={allOrders.docs} />
      </div>

      {/* Recent Orders Table */}
      <div className="border-1 border-border rounded-lg p-6">
        <CustomDataTable
          columns={OrdersColumns}
          data={recentOrders.docs}
          pgSize={5}
          tableTitle="Recent Orders"
          tableSubtitle="A list of the last 5 orders in the system including order number, customer details, and status. Please note that you can only edit the order status from here. To edit other details, please visit the Admin page."
        />
      </div>
    </div>
  )
}
