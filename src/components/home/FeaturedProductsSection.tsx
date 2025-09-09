// src/components/home/FeaturedProductsSection.tsx
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/ui/ProductCard'
import type { Product } from '@/payload-types'

interface FeaturedProductsProps {
  featuredProducts?: {
    enabled?: boolean | null
    title?: string | null
    subtitle?: string | null
    products?: (number | Product)[] | null // Can be IDs or full objects
    viewAllButton?: {
      text?: string | null
      url?: string | null
    } | null
  } | null
}

export const FeaturedProductsSection: React.FC<FeaturedProductsProps> = ({ featuredProducts }) => {
  if (!featuredProducts || !featuredProducts.enabled || !featuredProducts.products?.length)
    return null

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          {featuredProducts.title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{featuredProducts.title}</h2>
          )}
          {featuredProducts.subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {featuredProducts.subtitle}
            </p>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {featuredProducts.products
            .filter(
              (product): product is Product => typeof product === 'object' && product !== null,
            )
            .slice(0, 8)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>

        {/* View All Button */}
        {featuredProducts.viewAllButton?.text && (
          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link href={featuredProducts.viewAllButton.url || '/products'}>
                {featuredProducts.viewAllButton.text}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
