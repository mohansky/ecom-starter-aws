// src/app/(frontend)/dashboard/products/page.tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import CustomDataTable from '@/components/DataTable/CustomDataTable'
import { ProductsColumns } from '@/components/DataTable/Columns/ProductsColumn'

export default async function DashboardProductsPage() {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    limit: 50,
    sort: '-createdAt',
    depth: 2,
  })

  return (
    <div className="border-1 border-border rounded-lg p-6">
      <CustomDataTable
        columns={ProductsColumns}
        data={products.docs}
        pgSize={10}
        tableTitle="Products"
        tableSubtitle="Manage your product catalog including inventory, pricing, and availability."
        showDatePicker
        dateField="createdAt"
        initialColumnVisibility={{
          excerpt: false,
          sku: false,
          weight: false,
        }}
        filters={[
          { column: 'title', placeholder: 'Find by Title' },
          { column: 'sku', placeholder: 'Find by SKU' },
          { column: 'status', placeholder: 'Find by Status' },
        ]}
      />

      <div className="mt-6">
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Product Management</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Products support variants, categories, inventory tracking, and SEO optimization. 
                  Use the Payload admin panel to add or edit products with full rich-text descriptions and image galleries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}