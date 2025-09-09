// src/app/(frontend)/dashboard/orders/page.tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import CustomDataTable from '@/components/DataTable/CustomDataTable'
import { OrdersColumns } from '@/components/DataTable/Columns/OrdersColumn'

export default async function DashboardOrdersPage() {
  const payload = await getPayload({ config })

  const orders = await payload.find({
    collection: 'orders',
    limit: 50,
    sort: '-createdAt',
    depth: 2,
  })

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
