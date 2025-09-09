// src/components/home/TextWithImageSection.tsx
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import type { Page, Media } from '@/payload-types'

interface TextWithImageProps {
  textWithImage?: {
    enabled?: boolean | null
    title?: string | null
    content?: {
      root: {
        type: string
        children: {
          type: string
          version: number
          [k: string]: unknown
        }[]
        direction: ('ltr' | 'rtl') | null
        format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
        indent: number
        version: number
      }
      [k: string]: unknown
    } | null
    image?: (number | null) | Media
    imagePosition?: ('left' | 'right') | null
    button?: {
      text?: string | null
      type?: ('link' | 'page') | null
      url?: string | null
      page?: (number | null) | Page
    }
  } | null
}

export const TextWithImageSection: React.FC<TextWithImageProps> = ({ textWithImage }) => {
  if (!textWithImage || !textWithImage.enabled) return null

  const getButtonHref = () => {
    if (!textWithImage.button || !textWithImage.button.type) return '#'

    switch (textWithImage.button.type) {
      case 'link':
        return textWithImage.button.url || '#'
      case 'page':
        return `/${typeof textWithImage.button.page === 'object' ? textWithImage.button.page?.slug : ''}`
      default:
        return '#'
    }
  }

  const isImageLeft = textWithImage.imagePosition === 'left'

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div
          className={`grid lg:grid-cols-2 gap-12 items-center ${isImageLeft ? 'lg:grid-flow-col-dense' : ''}`}
        >
          {/* Text Content */}
          <div className={isImageLeft ? 'lg:col-start-2' : ''}>
            {textWithImage.title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{textWithImage.title}</h2>
            )}
            {textWithImage.content && (
              <div className="prose prose-lg max-w-none mb-8">
                <RichTextRenderer content={textWithImage.content} />
              </div>
            )}
            {textWithImage.button?.text && (
              <Button asChild size="lg">
                <Link href={getButtonHref()}>{textWithImage.button.text}</Link>
              </Button>
            )}
          </div>

          {/* Image */}
          {textWithImage.image && (
            <div
              className={`relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden ${isImageLeft ? 'lg:col-start-1' : ''}`}
            >
              <Image
                src={
                  typeof textWithImage.image === 'object' && textWithImage.image.url
                    ? textWithImage.image.url
                    : typeof textWithImage.image === 'string'
                      ? textWithImage.image
                      : ''
                }
                alt={
                  typeof textWithImage.image === 'object' && textWithImage.image.alt
                    ? textWithImage.image.alt
                    : textWithImage.title || 'Section image'
                }
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
