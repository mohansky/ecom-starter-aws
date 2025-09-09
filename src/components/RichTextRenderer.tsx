// src/components/RichTextRenderer.tsx
import React, { JSX } from 'react'

interface LexicalNode {
  type: string
  version?: number
  children?: LexicalNode[]
  text?: string
  format?: number
  mode?: string
  style?: string
  direction?: 'ltr' | 'rtl'
  indent?: number
  tag?: string
  fields?: {
    url?: string
    newTab?: boolean
    [key: string]: unknown
  }
  [key: string]: unknown
}

interface RichTextContent {
  root?: {
    type: string
    children: LexicalNode[]
    direction: ('ltr' | 'rtl') | null
    format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
    indent: number
    version: number
  }
  [key: string]: unknown
}

interface RichTextRendererProps {
  content: RichTextContent
  className?: string
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '' }) => {
  if (!content) return null

  const renderNode: (node: LexicalNode, index?: number, parentKey?: string) => React.ReactNode = (
    node: LexicalNode,
    index: number = 0,
    parentKey: string = '',
  ) => {
    if (!node) return null

    const nodeKey = `${parentKey}-${node.type}-${index}-${node.version || ''}`

    switch (node.type) {
      case 'paragraph':
        return (
          <p key={nodeKey} className="mb-4">
            {node.children?.map((child: LexicalNode, childIndex: number) =>
              renderNode(child, childIndex, nodeKey),
            )}
          </p>
        )

      case 'heading':
        const HeadingTag = `h${node.tag}` as keyof JSX.IntrinsicElements
        const headingClasses = {
          h1: 'text-4xl font-bold mb-6',
          h2: 'text-3xl font-bold mb-5',
          h3: 'text-2xl font-semibold mb-4',
          h4: 'text-xl font-semibold mb-3',
          h5: 'text-lg font-semibold mb-3',
          h6: 'text-base font-semibold mb-2',
        }
        return (
          <HeadingTag
            key={nodeKey}
            className={
              headingClasses[node.tag as keyof typeof headingClasses] ||
              'text-base font-semibold mb-2'
            }
          >
            {node.children?.map((child: LexicalNode, childIndex: number) =>
              renderNode(child, childIndex, nodeKey),
            )}
          </HeadingTag>
        )

      case 'list':
        const ListTag = node.listType === 'number' ? 'ol' : 'ul'
        const listClasses =
          node.listType === 'number'
            ? 'list-decimal list-inside mb-4 ml-4'
            : 'list-disc list-inside mb-4 ml-4'
        return (
          <ListTag key={nodeKey} className={listClasses}>
            {node.children?.map((child: LexicalNode, childIndex: number) =>
              renderNode(child, childIndex, nodeKey),
            )}
          </ListTag>
        )

      case 'listitem':
        return (
          <li key={nodeKey} className="mb-1">
            {node.children?.map((child: LexicalNode, childIndex: number) =>
              renderNode(child, childIndex, nodeKey),
            )}
          </li>
        )

      case 'link':
        return (
          <a
            key={nodeKey}
            href={node.fields?.url || '#'}
            className="text-primary hover:text-primary/80 underline"
            target={node.fields?.newTab ? '_blank' : undefined}
            rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}
          >
            {node.children?.map((child: LexicalNode, childIndex: number) =>
              renderNode(child, childIndex, nodeKey),
            )}
          </a>
        )

      case 'linebreak':
        return <br key={nodeKey} />

      case 'text':
        let textElement: React.ReactNode = node.text

        // Check format property for formatting (1 = bold, 2 = italic, etc.)
        if ((node.format && node.format & 1) || node.bold) {
          textElement = <strong>{textElement}</strong>
        }
        if ((node.format && node.format & 2) || node.italic) {
          textElement = <em>{textElement}</em>
        }
        if ((node.format && node.format & 4) || node.underline) {
          textElement = <u>{textElement}</u>
        }
        if ((node.format && node.format & 8) || node.strikethrough) {
          textElement = <s>{textElement}</s>
        }
        if (node.code) {
          textElement = (
            <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{textElement}</code>
          )
        }

        return <React.Fragment key={nodeKey}>{textElement}</React.Fragment>

      case 'quote':
        return (
          <blockquote key={nodeKey} className="border-l-4 border-border pl-4 italic mb-4">
            {node.children?.map((child: LexicalNode, childIndex: number) =>
              renderNode(child, childIndex, nodeKey),
            )}
          </blockquote>
        )

      case 'code':
        return (
          <pre key={nodeKey} className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
            <code className="text-sm font-mono">
              {node.children?.map((child: LexicalNode, childIndex: number) =>
                renderNode(child, childIndex, nodeKey),
              )}
            </code>
          </pre>
        )

      default:
        // Handle unknown node types by rendering their children
        if (node.children) {
          return (
            <React.Fragment key={nodeKey}>
              {node.children.map((child: LexicalNode, childIndex: number) =>
                renderNode(child, childIndex, nodeKey),
              )}
            </React.Fragment>
          )
        }
        return null
    }
  }

  if (typeof content === 'string') {
    return <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
  }

  if (content.root) {
    return (
      <div className={className}>
        {content.root.children?.map((node: LexicalNode, index: number) => renderNode(node, index, 'root'))}
      </div>
    )
  }

  return <div className={className}>{JSON.stringify(content)}</div>
}
