import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Product } from '@/payload-types'

export async function POST(request: NextRequest) {
  try {
    const { productId, variantId, quantityChange } = await request.json()

    if (!productId || quantityChange === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Get current product
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // If updating variant stock
    if (variantId && product.variants) {
      const updatedVariants = product.variants.map((variant: NonNullable<Product['variants']>[0]) => {
        if (variant.id === variantId) {
          const currentQuantity = variant.quantity || 0
          const newQuantity = Math.max(0, currentQuantity + quantityChange)
          return { ...variant, quantity: newQuantity }
        }
        return variant
      })

      await payload.update({
        collection: 'products',
        id: productId,
        data: {
          variants: updatedVariants,
        },
      })
    } 
    // If updating base product stock
    else {
      const currentQuantity = product.quantity || 0
      const newQuantity = Math.max(0, currentQuantity + quantityChange)

      await payload.update({
        collection: 'products',
        id: productId,
        data: {
          quantity: newQuantity,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Stock update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}