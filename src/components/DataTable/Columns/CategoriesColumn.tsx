'use client'
// src/components/DataTable/Columns/CategoriesColumn.tsx
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { FolderOpen, ArrowUpDown, Eye, Edit, FileImage, TreePine } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Category, Media } from '@/payload-types'
import Link from 'next/link'
import DateFormatter from '@/components/DateFormater'

export const CategoriesColumns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-48"
        >
          <FolderOpen className="mr-2 h-4 w-4" />
          Category Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const category = row.original
      return (
        <div className="flex items-center space-x-2">
          <div className="flex flex-col">
            <span className="font-medium">{category.name}</span>
            {category.description && (
              <span className="text-sm text-muted-foreground truncate max-w-48">
                {category.description}
              </span>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Slug
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const slug = row.getValue('slug') as string
      return (
        <Badge variant="outline" className="font-mono text-xs">
          {slug}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'parent',
    header: 'Parent Category',
    cell: ({ row }) => {
      const parent = row.getValue('parent') as Category | number | null | undefined
      return parent ? (
        <div className="flex items-center">
          <TreePine className="mr-1 h-3 w-3" />
          <Badge variant="secondary" className="text-xs">
            {typeof parent === 'object' ? parent.name : parent}
          </Badge>
        </div>
      ) : (
        <Badge variant="outline" className="text-xs">
          Root Category
        </Badge>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return <Badge variant={status === 'active' ? 'default' : 'secondary'}>{status}</Badge>
    },
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const image = row.getValue('image') as Media | number | null | undefined
      return image ? (
        <div className="flex items-center">
          <FileImage className="mr-1 h-3 w-3" />
          <Badge variant="outline" className="text-xs">
            Has image
          </Badge>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">No image</span>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      return description ? (
        <div className="max-w-48 truncate text-sm text-muted-foreground">{description}</div>
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
      return <DateFormatter dateString={row.getValue('createdAt')} />
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const category = row.original
      return (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/products?category=${category.slug}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/collections/categories/${category.id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )
    },
  },
]
