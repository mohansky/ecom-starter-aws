// src/app/(frontend)/dashboard/orders/page.tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import CustomDataTable from '@/components/DataTable/CustomDataTable'
import { OrdersColumns } from '@/components/DataTable/Columns/OrdersColumn'

export default async function DashboardOrdersPage() {
  let orders = { docs: [] as any[] }
  
  // Skip database operations during build
  if (!process.env.SKIP_BUILD_DATABASE) {
    try {
    const payload = await getPayload({ config })

    orders = await payload.find({
      collection: 'orders',
      limit: 50,
      sort: '-createdAt',
      depth: 2,
    })
    } catch (error) {
      console.error('Database connection failed:', error)
    }
  }

  return (
    <div className="border-1 border-border rounded-lg p-6">
      <CustomDataTable
        columns={OrdersColumns}
        data={orders.docs}
        pgSize={5}
        tableTitle="Orders Recieved"
        tableSubtitle="A list of all orders in the system including order number, customer details, and status."
        showDatePicker
        dateField="createdAt"
        filters={[
          { column: 'orderNumber', placeholder: 'Find by Order Number' },
          { column: 'status', placeholder: 'Find by Status' },
        ]}
      />
    </div>
  )
}
export const dynamic = 'force-dynamic'
