// src/components/RenderBlocks.tsx
import React from 'react'
import { HeroBlock } from './blocks/HeroBlock'
import { TextWithImageBlock } from './blocks/TextWithImageBlock'
import { RichTextBlock } from './blocks/RichTextBlock'
import { ProductShowcaseBlock } from './blocks/ProductShowcaseBlock'
import type { Page } from '@/payload-types'

type Block = NonNullable<Page['pageBuilder']>[number]

interface Props {
  blocks: Block[]
}

export const RenderBlocks: React.FC<Props> = ({ blocks }) => {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={block.id || index} block={block} />
          case 'textWithImage':
            return <TextWithImageBlock key={block.id || index} block={block} />
          case 'richText':
            return <RichTextBlock key={block.id || index} block={block} />
          case 'productShowcase':
            return <ProductShowcaseBlock key={block.id || index} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}
