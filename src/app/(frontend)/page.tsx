// src/app/(frontend)/page.tsx
import React from 'react'
import { getHomePage } from '@/lib/getHomePage'
import {
  HeroSection,
  TextWithImageSection,
  FeaturedProductsSection,
  FeaturedCategoriesSection,
} from '@/components/home'

// Force dynamic rendering for Railway deployment
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const homePageData = await getHomePage()

  return (
    <div className="min-h-screen">
      <HeroSection hero={homePageData?.hero} />
      <TextWithImageSection textWithImage={homePageData?.textWithImage} />
      <FeaturedProductsSection featuredProducts={homePageData?.featuredProducts} />
      <FeaturedCategoriesSection featuredCategories={homePageData?.featuredCategories} />
    </div>
  )
}
