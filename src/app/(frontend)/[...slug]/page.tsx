// src/app/(frontend)/[...slug]/page.tsx
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Page } from '@/payload-types'
import { RenderBlocks } from '@/components/RenderBlocks'

type Args = {
  params: Promise<{
    slug?: string[]
  }>
}

export default async function Page({ params }: Args) {
  const { slug } = await params
  const slugPath = slug?.join('/') || ''

  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slugPath,
      },
    },
    limit: 1,
  })

  const page = pages.docs[0] as Page

  if (!page) {
    return notFound()
  }

  return (
    <>
      {/* Page Builder Content */}
      {page.pageBuilder && page.pageBuilder.length > 0 ? (
        <RenderBlocks blocks={page.pageBuilder} />
      ) : (
        /* Fallback to legacy content */
        page.content && (
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
          </div>
        )
      )}
    </>
  )
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
    where: {
      status: {
        equals: 'published',
      },
    },
    limit: 1000,
  })

  return pages.docs.map((page) => ({
    slug: page.slug.split('/').filter(Boolean),
  }))
}

export async function generateMetadata({ params }: Args) {
  const { slug } = await params
  const slugPath = slug?.join('/') || ''

  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slugPath,
      },
    },
    limit: 1,
  })

  const page = pages.docs[0] as Page

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.excerpt,
    keywords: page.seo?.keywords,
    openGraph: {
      title: page.seo?.title || page.title,
      description: page.seo?.description || page.excerpt,
      images: page.seo?.ogImage
        ? [
            {
              url: typeof page.seo.ogImage === 'object' ? page.seo.ogImage.url || '' : '',
            },
          ]
        : [],
    },
  }
}
