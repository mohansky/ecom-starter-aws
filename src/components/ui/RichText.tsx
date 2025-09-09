import React from 'react'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { RichTextRenderer } from '../RichTextRenderer'

// Flexible content type that can handle various rich text formats
type RichTextContentType = 
  | string // HTML string
  | { // Lexical JSON structure
      root?: {
        type: string
        children: unknown[]
        [key: string]: unknown
      }
      [key: string]: unknown
    }
  | null
  | undefined

interface RichTextProps {
  content: RichTextContentType
  className?: string
  variant?: 'prose' | 'compact'
}

export const RichText: React.FC<RichTextProps> = ({ 
  content, 
  className = '', 
  variant = 'prose' 
}) => {
  if (!content) return null

  const baseClasses = variant === 'prose' 
    ? 'prose prose-lg max-w-none prose-headings:font-bold prose-p:mb-4 prose-ul:mb-4 prose-ol:mb-4 prose-li:mb-1'
    : 'text-base'

  // If content is already HTML string, render it directly
  if (typeof content === 'string') {
    return (
      <div 
        className={`${baseClasses} ${className}`}
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    )
  }

  // If content has root (Lexical JSON structure), try RichTextRenderer first
  if (typeof content === 'object' && content && 'root' in content) {
    return (
      <RichTextRenderer 
        content={content as any} // eslint-disable-line @typescript-eslint/no-explicit-any
        className={`${baseClasses} ${className}`}
      />
    )
  }

  // Fallback: try to convert Lexical to HTML
  try {
    if (typeof content === 'object' && content) {
      const htmlContent = convertLexicalToHTML({ data: content as any }) // eslint-disable-line @typescript-eslint/no-explicit-any
      if (htmlContent) {
        return (
          <div 
            className={`${baseClasses} ${className}`}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        )
      }
    }
  } catch (error) {
    console.warn('Failed to convert rich text content:', error)
  }

  // Last resort: render as RichTextRenderer (handles unknown formats gracefully)
  return (
    <RichTextRenderer 
      content={content as any} // eslint-disable-line @typescript-eslint/no-explicit-any
      className={`${baseClasses} ${className}`}
    />
  )
}