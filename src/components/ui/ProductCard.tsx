import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/payload-types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { formatPrice } from '@/lib/formatHelpers'

interface ProductCardProps {
  product: Product
  showCategories?: boolean
  showTags?: boolean
  className?: string
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showCategories = false,
  showTags = false,
  className = '',
}) => {
  const getImageUrl = () => {
    const primaryImage = product.images?.[0]
    if (!primaryImage) return null
    if (typeof primaryImage.image === 'object' && primaryImage.image?.url)
      return primaryImage.image.url
    return null
  }

  const getImageAlt = () => {
    const primaryImage = product.images?.[0]
    if (primaryImage?.alt) return primaryImage.alt
    return product.title || 'Product image'
  }

  const imageUrl = getImageUrl()

  return (
    <Card className={`group hover:shadow-lg transition-shadow ${className}`}>
      <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={getImageAlt()}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
        )}
      </div>

      <CardHeader>
        <CardTitle>{product.title}</CardTitle>
        {product.excerpt && <CardDescription>{product.excerpt}</CardDescription>}
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {showCategories && product.categories && product.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.categories.slice(0, 2).map((category) => {
              const categoryName = typeof category === 'object' ? category.name : category
              return (
                <Badge
                  key={typeof category === 'object' ? category.id : category}
                  // className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                >
                  {categoryName}
                </Badge>
              )
            })}
          </div>
        )}

        {showTags && product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tagObj, index) => (
              <Badge
                key={index}
                variant="outline"
                // className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {tagObj.tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col lg:flex-row gap-2 lg:gap-4 justify-between">
        {/* <Button>Add to Cart</Button> */}
        <Link href={`/products/${product.slug}`}>
          <Button>View Product</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
