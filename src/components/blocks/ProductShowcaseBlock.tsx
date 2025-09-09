// src/components/blocks/ProductShowcaseBlock.tsx
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Page, Product } from '@/payload-types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type ProductShowcaseBlock = Extract<
  NonNullable<Page['pageBuilder']>[number],
  { blockType: 'productShowcase' }
>

interface Props {
  block: ProductShowcaseBlock
}

export const ProductShowcaseBlock: React.FC<Props> = ({ block }) => {
  const { heading, description, displayType, products, layout, callToAction, settings } = block

  const paddingClasses = {
    none: '',
    small: 'py-8',
    medium: 'py-16',
    large: 'py-24',
  }

  const backgroundClasses = {
    white: 'bg-white',
    'gray-50': 'bg-gray-50',
    'gray-900': 'bg-gray-900 text-white',
    primary: 'bg-blue-600 text-white',
  }

  const columnClasses = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const spacingClasses = {
    compact: 'gap-4',
    normal: 'gap-6',
    spacious: 'gap-8',
  }

  const renderProduct = (product: Product) => {
    const primaryImage = product.images?.[0]
    const imageUrl = typeof primaryImage?.image === 'object' ? primaryImage.image?.url : ''
    const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

    return (
      <Card key={product.id} className="group overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={primaryImage?.alt || product.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
            {hasDiscount && layout?.showComparePrice && (
              <Badge variant="destructive" className="absolute top-2 left-2">
                Sale
              </Badge>
            )}
            {layout?.showQuickView && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
                <Button
                  variant="secondary"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  Quick View
                </Button>
              </div>
            )}
          </div>
        </Link>

        <CardContent className="p-4">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {product.title}
            </h3>

            {layout?.showPricing && (
              <div className="flex items-center gap-2 mt-2">
                <span className="font-semibold text-foreground">${product.price.toFixed(2)}</span>
                {layout?.showComparePrice && hasDiscount && product.compareAtPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>
            )}
          </Link>
        </CardContent>

        {layout?.showAddToCart && (
          <CardFooter className="p-4 pt-0">
            <Button className="w-full">Add to Cart</Button>
          </CardFooter>
        )}
      </Card>
    )
  }

  const renderCallToAction = () => {
    if (!callToAction?.enable) return null

    let href = '#'
    if (callToAction.type === 'link') {
      href = callToAction.url || '#'
    } else if (callToAction.type === 'page') {
      href = `/${typeof callToAction.page === 'object' ? callToAction.page?.slug : ''}`
    } else if (callToAction.type === 'category') {
      href = `/category/${typeof callToAction.category === 'object' ? callToAction.category?.slug : ''}`
    }

    return (
      <div className="text-center mt-12">
        <Button size="lg" asChild>
          <Link href={href}>{callToAction.label || 'View All Products'}</Link>
        </Button>
      </div>
    )
  }

  // For this demo, we'll render the manual products selection
  // In a real implementation, you'd fetch products based on displayType
  const productsToRender = products?.filter((p): p is Product => typeof p === 'object') || []

  return (
    <section
      className={`
        ${backgroundClasses[settings?.backgroundColor || 'white']} 
        ${paddingClasses[settings?.paddingTop || 'large']} 
        ${paddingClasses[settings?.paddingBottom || 'large']}
      `}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          {description && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>}
        </div>

        {/* Products Grid */}
        {productsToRender.length > 0 && (
          <div
            className={`grid ${columnClasses[layout?.columns || '3']} ${spacingClasses[layout?.spacing || 'normal']}`}
          >
            {productsToRender.map(renderProduct)}
          </div>
        )}

        {/* Display type notice for demo */}
        {displayType !== 'manual' && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Products will be loaded dynamically based on: <strong>{displayType}</strong>
              <br />
              <em>This requires additional implementation for fetching products.</em>
            </p>
          </div>
        )}

        {/* Call to Action */}
        {renderCallToAction()}
      </div>
    </section>
  )
}
