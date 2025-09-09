'use client'
// src/components/ProductsFilter.tsx
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/payload-types'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'
import { Badge } from './ui/badge'
import { X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'

type Props = {
  categories: Category[]
  tags: string[]
  currentParams: {
    categories?: string
    tags?: string
    search?: string
  }
}

export function ProductsFilter({ categories, tags, currentParams }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    currentParams.categories ? currentParams.categories.split(',') : [],
  )
  const [selectedTags, setSelectedTags] = useState<string[]>(
    currentParams.tags ? currentParams.tags.split(',') : [],
  )
  const [searchTerm, setSearchTerm] = useState(currentParams.search || '')

  const updateURL = (newCategories: string[], newTags: string[], newSearch: string) => {
    const params = new URLSearchParams(searchParams)

    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','))
    } else {
      params.delete('categories')
    }

    if (newTags.length > 0) {
      params.set('tags', newTags.join(','))
    } else {
      params.delete('tags')
    }

    if (newSearch.trim()) {
      params.set('search', newSearch.trim())
    } else {
      params.delete('search')
    }

    const queryString = params.toString()
    router.push(`/products${queryString ? `?${queryString}` : ''}`)
  }

  const handleCategoryChange = (categoryId: string, checked: boolean | string) => {
    const isChecked = typeof checked === 'string' ? checked === 'true' : checked
    const newCategories = isChecked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId)

    setSelectedCategories(newCategories)
    updateURL(newCategories, selectedTags, searchTerm)
  }

  const handleTagChange = (tag: string, checked: boolean | string) => {
    const isChecked = typeof checked === 'string' ? checked === 'true' : checked
    const newTags = isChecked ? [...selectedTags, tag] : selectedTags.filter((t) => t !== tag)

    setSelectedTags(newTags)
    updateURL(selectedCategories, newTags, searchTerm)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateURL(selectedCategories, selectedTags, searchTerm)
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedTags([])
    setSearchTerm('')
    router.push('/products')
  }

  const hasActiveFilters =
    selectedCategories.length > 0 || selectedTags.length > 0 || searchTerm.trim()

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Filters</CardTitle>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-6">
          <Label className="block text-sm font-medium text-gray-700 mb-2">Search Products</Label>
          <form onSubmit={handleSearchSubmit}>
            <div className="flex flex-col gap-2">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search..."
              />
              <Button type="submit">Search</Button>
            </div>
          </form>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(String(category.id))}
                  onCheckedChange={(checked) => handleCategoryChange(String(category.id), checked)}
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {category.name}
                </Label>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-sm text-gray-400">No categories available</p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {tags.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag}`}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={(checked) => handleTagChange(tag, checked)}
                />
                <Label htmlFor={`tag-${tag}`} className="text-sm font-normal cursor-pointer">
                  {tag}
                </Label>
              </div>
            ))}
            {tags.length === 0 && <p className="text-sm text-gray-400">No tags available</p>}
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((categoryId) => {
                const category = categories.find((c) => String(c.id) === categoryId)
                return category ? (
                  <Badge key={categoryId} className="inline-flex gap-3 pl-2 pr-0">
                    {category.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-auto h-auto"
                      onClick={() => handleCategoryChange(categoryId, false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </Badge>
                ) : null
              })}
              {selectedTags.map((tag) => (
                <Badge key={tag} className="flex items-center gap-2 capitalize">
                  {tag}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-auto h-auto"
                    onClick={() => handleTagChange(tag, false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Badge>
              ))}
              {searchTerm && (
                <Badge className="flex items-center gap-2 capitalize">
                  {searchTerm}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-auto h-auto"
                    onClick={() => {
                      setSearchTerm('')
                      updateURL(selectedCategories, selectedTags, '')
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
