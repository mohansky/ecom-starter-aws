'use client'
// src/components/DataTable/Columns/ProductsColumn.tsx
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Package,
  ArrowUpDown,
  Eye,
  Edit,
  Badge as BadgeIcon,
  Hash,
  Weight,
  Archive,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Product, Category } from '@/payload-types'
import Link from 'next/link'
import { formatRupees } from '@/lib/formatHelpers'
import DateFormatter from '@/components/DateFormater'

export const ProductsColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-48"
        >
          <Package className="mr-2 h-4 w-4" />
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex items-center space-x-2">
          <div className="flex flex-col items-center">
            <span className="font-medium">{product.title}</span>
            {product.excerpt && (
              <span className="text-xs text-muted-foreground truncate max-w-48">
                {product.excerpt}
              </span>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'sku',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <Hash className="mr-2 h-4 w-4" />
          SKU
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const sku = row.getValue('sku') as string
      return sku ? (
        <Badge variant="outline" className="font-mono text-xs">
          {sku}
        </Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const price = row.getValue('price') as number
      const compareAtPrice = row.original.compareAtPrice
      return (
        <div className="flex flex-col items-center">
          <span className="font-medium">{formatRupees(price)}</span>
          {compareAtPrice && compareAtPrice > price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatRupees(compareAtPrice)}
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <Archive className="mr-2 h-4 w-4" />
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const product = row.original
      const quantity = row.getValue('quantity') as number

      if (!product.trackQuantity) {
        return (
          <div className="text-center">
            <Badge variant="secondary">Not tracked</Badge>
          </div>
        )
      }

      const isLowStock = quantity < 10
      const isOutOfStock = quantity === 0

      return (
        <div className="text-center">
          <Badge variant={isOutOfStock ? 'destructive' : isLowStock ? 'secondary' : 'success'}>
            {quantity} units
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'categories',
    header: 'Categories',
    cell: ({ row }) => {
      const categories = row.getValue('categories') as (number | Category)[]
      return categories && categories.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {categories.slice(0, 2).map((category: number | Category) => (
            <Badge
              key={typeof category === 'object' ? category.id : category}
              variant="outline"
              className="text-xs"
            >
              {typeof category === 'object' ? category.name : category}
            </Badge>
          ))}
          {categories.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{categories.length - 2}
            </Badge>
          )}
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge
          variant={
            status === 'published' ? 'default' : status === 'draft' ? 'secondary' : 'outline'
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'featured',
    header: 'Featured',
    cell: ({ row }) => {
      const featured = row.getValue('featured') as boolean
      return featured ? (
        <Badge variant="default">
          <BadgeIcon className="mr-1 h-3 w-3" />
          Featured
        </Badge>
      ) : null
    },
  },
  {
    accessorKey: 'weight',
    header: 'Weight',
    cell: ({ row }) => {
      const weight = row.getValue('weight') as number
      return weight ? (
        <div className="flex items-center">
          <Weight className="mr-1 h-3 w-3" />
          <span className="text-sm">{weight}g</span>
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
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
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <DateFormatter dateString={row.getValue('createdAt')} />
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/products/${product.slug}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/collections/products/${product.id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )
    },
  },
]
