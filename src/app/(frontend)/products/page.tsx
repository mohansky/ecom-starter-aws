// src/app/(frontend)/products/page.tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Product, Category } from '@/payload-types'
import { ProductsFilter } from '@/components/ProductsFilter'
import { ProductCard } from '@/components/ui/ProductCard'
import type { Where } from 'payload'

type SearchParams = Promise<{
  categories?: string
  tags?: string
  search?: string
}>

type Props = {
  searchParams: SearchParams
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  let products: Product[] = []
  let categories: Category[] = []
  
  // Skip database operations during build
  if (!process.env.SKIP_BUILD_DATABASE) {
    try {
    const payload = await getPayload({ config })

    // Get all categories for the filter
    const categoriesResult = await payload.find({
      collection: 'categories',
      where: {
        status: {
          equals: 'active',
        },
      },
      limit: 100,
    })

    // Build query conditions based on filters
    const whereConditions: Where = {
      status: {
        equals: 'published',
      },
    }

    // Filter by categories
    if (params.categories) {
      const categoryIds = params.categories.split(',')
      whereConditions.categories = {
        in: categoryIds,
      }
    }

    // Filter by tags
    if (params.tags) {
      const tagList = params.tags.split(',')
      whereConditions['tags.tag'] = {
        in: tagList,
      }
    }

    // Search filter
    if (params.search) {
      whereConditions.title = {
        contains: params.search,
      }
    }

    // Get filtered products
    const productsResult = await payload.find({
      collection: 'products',
      where: whereConditions,
      limit: 50,
      sort: '-createdAt',
    })

    products = productsResult.docs as Product[]
    categories = categoriesResult.docs as Category[]
    } catch (error) {
      console.error('Database connection failed:', error)
    }
  }

  // Get all unique tags from products
  const allTags = new Set<string>()
  products.forEach((product) => {
    product.tags?.forEach((tagObj) => {
      if (tagObj.tag) {
        allTags.add(tagObj.tag)
      }
    })
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Products</h1>
        <p className="text-gray-600">
          Found {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductsFilter
            categories={categories}
            tags={Array.from(allTags)}
            currentParams={params}
          />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showCategories={true}
                  showTags={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams
  let title = 'Products'

  if (params.search) {
    title += ` - ${params.search}`
  }
  if (params.categories) {
    title += ' - Filtered'
  }

  return {
    title,
    description: 'Browse our collection of products with advanced filtering options.',
  }
}
export const dynamic = 'force-dynamic'
