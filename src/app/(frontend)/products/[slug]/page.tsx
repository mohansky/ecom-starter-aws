// src/app/(frontend)/products/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Product } from '@/payload-types'
import Image from 'next/image'
import { RichText } from '@/components/ui/RichText'
import { formatPrice } from '@/lib/formatHelpers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddToCartForm } from '@/components/AddToCartForm'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: Args) {
  const { slug } = await params

  // Skip database operations during build
  if (process.env.SKIP_BUILD_DATABASE) {
    return notFound()
  }

  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const product = products.docs[0] as Product

  if (!product) {
    return notFound()
  }

  const primaryImage = product.images?.[0]
  const imageUrl = typeof primaryImage?.image === 'object' ? primaryImage.image?.url : ''

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-1">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          {imageUrl && (
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={imageUrl}
                alt={primaryImage?.alt || product.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Additional Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((img, index) => {
                const imgUrl = typeof img.image === 'object' ? img.image?.url : ''
                return imgUrl ? (
                  <div
                    key={index}
                    className="relative aspect-square rounded overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={imgUrl}
                      alt={img.alt || `${product.title} image ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : null
              })}
            </div>
          )}

          {/* Gallery Images */}
          {product.gallery && product.gallery.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Gallery</h3>
              <div className="grid grid-cols-3 gap-2">
                {product.gallery.slice(0, 6).map((galleryImg, index) => {
                  const galleryUrl =
                    typeof galleryImg.image === 'object' ? galleryImg.image?.url : ''
                  return galleryUrl ? (
                    <div
                      key={index}
                      className="relative aspect-square rounded overflow-hidden bg-gray-100"
                    >
                      <Image
                        src={galleryUrl}
                        alt={galleryImg.alt || `${product.title} gallery ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : null
                })}
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold mb-4">{product.title}</CardTitle>
            {/* Pricing */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-semibold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-destructive-foreground font-light italic line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.categories.map((category, index) => {
                    const categoryName = typeof category === 'object' ? category.name : category
                    return (
                      <Badge key={typeof category === 'object' ? category.id : index}>
                        {categoryName}
                      </Badge>
                    )
                  })}

                  {product.tags && product.tags.length > 0 && (
                    <>
                      {product.tags.map((tagObj, index) => (
                        <Badge key={index} variant="outline">
                          {tagObj.tag}
                        </Badge>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {product.description && (
              <>
                <RichText content={product.description} className="" variant="prose" />
              </>
            )}

            <AddToCartForm product={product} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Static generation disabled for Railway deployment
// Pages will be generated on-demand at runtime
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Args) {
  const { slug } = await params

  // Skip database operations during build
  if (process.env.SKIP_BUILD_DATABASE) {
    return {
      title: 'Product',
      description: 'Product page',
    }
  }

  try {
    const payload = await getPayload({ config })

    const products = await payload.find({
      collection: 'products',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    })

    const product = products.docs[0] as Product

    if (!product) {
      return {
        title: 'Product Not Found',
      }
    }

    return {
      title: product.seo?.title || product.title,
      description:
        product.seo?.description ||
        `Shop ${product.title} for ${formatPrice ? formatPrice(product.price) : product.price}`,
      keywords: product.seo?.keywords,
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Product',
      description: 'Product page',
    }
  }
}
