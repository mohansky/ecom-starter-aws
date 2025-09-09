// src/components/blocks/HeroBlock.tsx
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Page, Category } from '@/payload-types'
import { RichTextRenderer } from '../RichTextRenderer'
import { Button } from '@/components/ui/button'

type HeroBlock = Extract<NonNullable<Page['pageBuilder']>[number], { blockType: 'hero' }>

interface Props {
  block: HeroBlock
}

export const HeroBlock: React.FC<Props> = ({ block }) => {
  const { type, backgroundImage, overlay, content } = block

  const heightClasses = {
    fullHeight: 'min-h-screen',
    halfHeight: 'min-h-[50vh]',
    autoHeight: 'py-24',
  }

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const backgroundImageUrl =
    typeof backgroundImage === 'object' && backgroundImage?.url ? backgroundImage.url : null

  const renderButton = (
    button: {
      type: 'link' | 'page' | 'category'
      url?: string | null
      page?: Page | number | null
      category?: Category | number | null
      text?: string | null
      label?: string | null
      style?: 'primary' | 'outline' | 'secondary' | 'ghost' | null
      openInNewTab?: boolean | null
      id?: string | null
    },
    index: number,
  ) => {
    let href = '#'
    if (button.type === 'link') {
      href = button.url || '#'
    } else if (button.type === 'page') {
      href = `/${typeof button.page === 'object' ? button.page?.slug : ''}`
    } else if (button.type === 'category') {
      href = `/category/${typeof button.category === 'object' ? button.category?.slug : ''}`
    }

    const buttonVariant =
      button.style === 'outline'
        ? 'outline'
        : button.style === 'secondary'
          ? 'secondary'
          : 'default'

    return (
      <Button key={index} variant={buttonVariant} size="lg" asChild>
        <Link
          href={href}
          target={button.openInNewTab ? '_blank' : undefined}
          rel={button.openInNewTab ? 'noopener noreferrer' : undefined}
        >
          {button.label}
        </Link>
      </Button>
    )
  }

  return (
    <section
      className={`relative ${heightClasses[type]} flex items-center justify-center overflow-hidden`}
    >
      {/* Background Image */}
      {backgroundImageUrl && (
        <div className="absolute inset-0 z-0">
          <Image src={backgroundImageUrl} alt="" fill className="object-cover" priority />
        </div>
      )}

      {/* Overlay */}
      {overlay?.enable && (
        <div
          className={`absolute inset-0 z-10`}
          style={{
            backgroundColor:
              overlay.color === 'black'
                ? '#000000'
                : overlay.color === 'white'
                  ? '#ffffff'
                  : overlay.color === 'gray-900'
                    ? '#111827'
                    : overlay.color === 'blue-900'
                      ? '#1e3a8a'
                      : '#000000',
            opacity: overlay.opacity ? parseInt(overlay.opacity) / 100 : 0.5,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4">
        <div
          className={`max-w-4xl ${content.alignment === 'center' ? 'mx-auto' : content.alignment === 'right' ? 'ml-auto' : ''}`}
        >
          <div className={alignmentClasses[content.alignment || 'left']}>
            {content.eyebrow && (
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                {content.eyebrow}
              </p>
            )}

            <h1 className="text-4xl md:text-6xl font-bold text-gray-200 mb-6">{content.heading}</h1>

            {content.subheading && (
              <p className="text-xl md:text-3xl text-gray-400 mb-8">{content.subheading}</p>
            )}

            {content.description && (
              <RichTextRenderer content={content.description} className="prose prose-lg mb-8" />
            )}

            {content.buttons && content.buttons.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {content.buttons.map((button, index) => renderButton(button, index))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
