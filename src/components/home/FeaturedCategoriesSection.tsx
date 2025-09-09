// src/components/home/FeaturedCategoriesSection.tsx
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import type { Category } from '@/payload-types'

interface FeaturedCategoriesProps {
  featuredCategories?: {
    enabled?: boolean | null
    title?: string | null
    subtitle?: string | null
    categories?: (number | Category)[] | null
  } | null
}

export const FeaturedCategoriesSection: React.FC<FeaturedCategoriesProps> = ({
  featuredCategories,
}) => {
  if (!featuredCategories || !featuredCategories.enabled || !featuredCategories.categories?.length)
    return null

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          {featuredCategories.title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{featuredCategories.title}</h2>
          )}
          {featuredCategories.subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {featuredCategories.subtitle}
            </p>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCategories.categories
            .filter(
              (category): category is Category => typeof category === 'object' && category !== null,
            )
            .slice(0, 6)
            .map((category) => (
              <Card
                key={category.id}
                className="overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <Link href={`/category/${category.slug}`}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {category.image && typeof category.image === 'object' && category.image.url ? (
                      <Image
                        src={category.image.url}
                        alt={category.name || 'Category image'}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  </div>

                  <CardContent className="p-6">
                    <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </CardContent>
                </Link>
              </Card>
            ))}
        </div>
      </div>
    </section>
  )
}
