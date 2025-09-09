// src/components/blocks/TextWithImageBlock.tsx
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Page, Category } from '@/payload-types'
import { RichTextRenderer } from '../RichTextRenderer'

type TextWithImageBlock = Extract<
  NonNullable<Page['pageBuilder']>[number],
  { blockType: 'textWithImage' }
>

interface Props {
  block: TextWithImageBlock
}

export const TextWithImageBlock: React.FC<Props> = ({ block }) => {
  const { layout, verticalAlignment, image, imageSize, content, settings } = block

  const alignmentClasses = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
  }

  const imageSizeClasses = {
    oneThird: layout === 'imageLeft' ? 'lg:w-1/3' : 'lg:w-1/3',
    half: layout === 'imageLeft' ? 'lg:w-1/2' : 'lg:w-1/2',
    twoThirds: layout === 'imageLeft' ? 'lg:w-2/3' : 'lg:w-2/3',
  }

  const textSizeClasses = {
    oneThird: layout === 'imageLeft' ? 'lg:w-2/3' : 'lg:w-2/3',
    half: layout === 'imageLeft' ? 'lg:w-1/2' : 'lg:w-1/2',
    twoThirds: layout === 'imageLeft' ? 'lg:w-1/3' : 'lg:w-1/3',
  }

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

  const imageUrl = typeof image === 'object' && image?.url ? image.url : ''

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
    const baseClasses =
      'inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200'
    const styleClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
    } as const

    const buttonStyle = (button.style as keyof typeof styleClasses) || 'primary'
    const classes = `${baseClasses} ${styleClasses[buttonStyle]}`

    let href = '#'
    if (button.type === 'link') {
      href = button.url || '#'
    } else if (button.type === 'page') {
      href = `/${typeof button.page === 'object' ? button.page?.slug : ''}`
    } else if (button.type === 'category') {
      href = `/category/${typeof button.category === 'object' ? button.category?.slug : ''}`
    }

    return (
      <Link
        key={index}
        href={href}
        className={classes}
        target={button.openInNewTab ? '_blank' : undefined}
        rel={button.openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {button.label}
      </Link>
    )
  }

  const ImageComponent = () => (
    <div className={`${imageSizeClasses[imageSize || 'half']} mb-8 lg:mb-0`}>
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={typeof image === 'object' ? image?.alt || '' : ''}
          fill
          className="object-cover"
        />
      </div>
    </div>
  )

  const TextComponent = () => (
    <div className={`${textSizeClasses[imageSize || 'half']}`}>
      {content.eyebrow && (
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
          {content.eyebrow}
        </p>
      )}

      <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.heading}</h2>

      {content.subheading && <p className="text-xl text-gray-600 mb-6">{content.subheading}</p>}

      <RichTextRenderer content={content.richText} className="prose prose-lg mb-8" />

      {content.buttons && content.buttons.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {content.buttons.map((button, index) => renderButton(button, index))}
        </div>
      )}
    </div>
  )

  return (
    <section
      className={`
        ${backgroundClasses[settings?.backgroundColor || 'white']} 
        ${paddingClasses[settings?.paddingTop || 'medium']} 
        ${paddingClasses[settings?.paddingBottom || 'medium']}
      `}
    >
      <div className="container mx-auto px-4">
        <div
          className={`flex flex-col lg:flex-row gap-8 lg:gap-12 ${alignmentClasses[verticalAlignment || 'center']}`}
        >
          {layout === 'imageLeft' ? (
            <>
              <ImageComponent />
              <TextComponent />
            </>
          ) : (
            <>
              <TextComponent />
              <ImageComponent />
            </>
          )}
        </div>
      </div>
    </section>
  )
}
