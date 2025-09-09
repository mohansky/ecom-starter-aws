// src/components/home/HeroSection.tsx
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import type { Media, Page, Category } from '@/payload-types'

interface HeroProps {
  hero: {
    title?: string | null
    subtitle?: string | null
    backgroundImage?:
      | {
          url: string
          alt: string
        }
      | Media
      | number
      | null
    ctaButton?: {
      text?: string | null
      type?: 'link' | 'page' | 'category' | null
      url?: string | null
      page?:
        | {
            slug: string
          }
        | Page
        | number
        | null
      category?:
        | {
            slug: string
          }
        | Category
        | number
        | null
    } | null
  }
}

export const HeroSection: React.FC<HeroProps> = ({ hero }) => {
  if (!hero) return null
  const getButtonHref = () => {
    if (!hero.ctaButton || !hero.ctaButton.type) return '#'

    switch (hero.ctaButton.type) {
      case 'link':
        return hero.ctaButton.url || '#'
      case 'page':
        return `/${typeof hero.ctaButton.page === 'object' ? hero.ctaButton.page?.slug : ''}`
      case 'category':
        return `/category/${typeof hero.ctaButton.category === 'object' ? hero.ctaButton.category?.slug : ''}`
      default:
        return '#'
    }
  }

  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {hero.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={
              typeof hero.backgroundImage === 'object' && hero.backgroundImage.url
                ? hero.backgroundImage.url
                : typeof hero.backgroundImage === 'string'
                  ? hero.backgroundImage
                  : ''
            }
            alt={
              typeof hero.backgroundImage === 'object' && hero.backgroundImage.alt
                ? hero.backgroundImage.alt
                : 'Hero background'
            }
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {hero.title || 'Welcome to Our Store'}
        </h1>
        {hero.subtitle && <p className="text-xl md:text-2xl mb-8 text-gray-200">{hero.subtitle}</p>}
        {hero.ctaButton?.text && (
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href={getButtonHref()}>{hero.ctaButton.text}</Link>
          </Button>
        )}
      </div>
    </section>
  )
}
