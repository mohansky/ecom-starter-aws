// src/app/(frontend)/dashboard/categories/page.tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import CustomDataTable from '@/components/DataTable/CustomDataTable'
import { CategoriesColumns } from '@/components/DataTable/Columns/CategoriesColumn'

export default async function DashboardCategoriesPage() {
  let categories = { docs: [] as any[] }
  
  // Skip database operations during build
  if (!process.env.SKIP_BUILD_DATABASE) {
    try {
    const payload = await getPayload({ config })

    categories = await payload.find({
      collection: 'categories',
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
        columns={CategoriesColumns}
        data={categories.docs}
        pgSize={10}
        tableTitle="Categories"
        tableSubtitle="Organize your products into categories for better navigation and discovery."
        showDatePicker
        dateField="createdAt"
        initialColumnVisibility={{
          description: false,
          seo: false,
        }}
        filters={[
          { column: 'name', placeholder: 'Find by Name' },
          { column: 'slug', placeholder: 'Find by Slug' },
          { column: 'status', placeholder: 'Find by Status' },
        ]}
      />

      <div className="mt-6">
        <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v2h2V6H5zM3 13a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm2 2v2h2v-2H5zM13 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zm2 2v2h2V6h-2zM13 13a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4zm2 2v2h2v-2h-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-purple-800">Category Management</h3>
              <div className="mt-2 text-sm text-purple-700">
                <p>
                  Categories support hierarchical organization with parent-child relationships, 
                  custom images, and SEO optimization. Use categories to help customers 
                  navigate your product catalog more effectively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}export const dynamic = 'force-dynamic'
