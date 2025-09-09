// src/components/blocks/RichTextBlock.tsx
import React from 'react'
import type { Page } from '@/payload-types'
import { RichTextRenderer } from '../RichTextRenderer'

// Use a more flexible type for the rich text content from Payload
type PayloadRichTextContent = {
  [key: string]: unknown
}

type RichTextBlock = Extract<NonNullable<Page['pageBuilder']>[number], { blockType: 'richText' }>

interface Props {
  block: RichTextBlock
}

export const RichTextBlock: React.FC<Props> = ({ block }) => {
  const { columns, maxWidth, content, columnOne, columnTwo, settings } = block

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }

  const maxWidthClasses = {
    small: 'max-w-prose',
    medium: 'max-w-4xl',
    large: 'max-w-6xl',
    full: 'max-w-full',
  }

  const paddingClasses = {
    none: '',
    small: 'py-8',
    medium: 'py-16',
    large: 'py-24',
  }

  const backgroundClasses = {
    none: '',
    white: 'bg-white',
    'gray-50': 'bg-gray-50',
    'gray-900': 'bg-gray-900 text-white',
    primary: 'bg-blue-600 text-white',
  }

  const renderContent = (richTextContent: PayloadRichTextContent, className = '') => {
    return (
      <RichTextRenderer
        content={richTextContent}
        className={`${className} ${settings?.enableDropCap ? '[&>p:first-child]:first-letter:text-7xl [&>p:first-child]:first-letter:font-bold [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:leading-none [&>p:first-child]:first-letter:mr-2 [&>p:first-child]:first-letter:mt-1' : ''}`}
      />
    )
  }

  return (
    <section
      className={`
        ${backgroundClasses[settings?.backgroundColor || 'none']} 
        ${paddingClasses[settings?.paddingTop || 'medium']} 
        ${paddingClasses[settings?.paddingBottom || 'medium']}
      `}
    >
      <div className="container mx-auto px-4">
        <div className={`${alignmentClasses[settings?.alignment || 'left']}`}>
          {columns === 'one' ? (
            <div className={`mx-auto ${maxWidthClasses[maxWidth || 'medium']}`}>
              {content && renderContent(content)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div>{columnOne && renderContent(columnOne)}</div>
              <div>{columnTwo && renderContent(columnTwo)}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
