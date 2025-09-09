// src/app/(frontend)/dashboard/customers/page.tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import CustomDataTable from '@/components/DataTable/CustomDataTable'
import { CustomersColumns } from '@/components/DataTable/Columns/CustomersColumn'

export default async function DashboardCustomersPage() {
  const payload = await getPayload({ config })

  const customers = await payload.find({
    collection: 'customers',
    limit: 50,
    sort: '-createdAt',
    depth: 1,
  })

  return (
    <div className="border-1 border-border rounded-lg p-6">
      <CustomDataTable
        columns={CustomersColumns}
        data={customers.docs}
        pgSize={5}
        tableTitle="Customers"
        tableSubtitle="A list of all customers including their order history and contact information."
        showDatePicker
        dateField="createdAt"
        initialColumnVisibility={{
          firstName: false,
          lastName: false,
        }}
        filters={[
          { column: 'email', placeholder: 'Find by Email' },
          { column: 'firstName', placeholder: 'Find by First Name' },
          { column: 'lastName', placeholder: 'Find by Last Name' },
          { column: 'phone', placeholder: 'Find by Phone' },
          { column: 'status', placeholder: 'Find by Status' },
        ]}
      />

      <div className="mt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Auto-Generated Customer Data</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Customer records are automatically created from order data. Customer statistics
                  (total orders, total spent) are automatically calculated and updated when orders
                  are placed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
