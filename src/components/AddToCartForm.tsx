'use client'
// src/components/AddToCartForm.tsx
import { useState, useCallback } from 'react'
import type { Product } from '@/payload-types'
import { useShoppingCart } from '@/contexts/CartContext'
import type { CartVariant } from '@/types'
import {
  getEffectiveQuantity,
  getEffectiveWeight,
  getEffectiveDimensions,
  getEffectiveSku,
} from '@/types'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/formatHelpers'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Minus } from 'lucide-react'

interface AddToCartFormProps {
  product: Product
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const { addToCart, isInCart, getCartItem } = useShoppingCart()
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const groupedVariants =
    product.variants?.reduce(
      (acc, variant) => {
        if (!acc[variant.name]) {
          acc[variant.name] = []
        }
        acc[variant.name].push(variant)
        return acc
      },
      {} as Record<string, typeof product.variants>,
    ) || {}

  // Track variant selections with individual quantities
  const [variantSelections, setVariantSelections] = useState<
    Record<string, { variant: NonNullable<Product['variants']>[0]; quantity: number }>
  >(() => {
    const defaults: Record<
      string,
      { variant: NonNullable<Product['variants']>[0]; quantity: number }
    > = {}
    Object.entries(groupedVariants).forEach(([variantType, variants]) => {
      if (variants && variants.length > 0) {
        const firstVariant = variants[0]
        defaults[`${variantType}-${firstVariant.value}`] = {
          variant: firstVariant,
          quantity: 0,
        }
      }
    })
    return defaults
  })

  const [quantity, setQuantity] = useState(0)

  // Get currently selected variants (those with quantity > 0)
  const selectedVariants = Object.values(variantSelections)
    .filter((selection) => selection.quantity > 0)
    .map((selection) => ({
      name: selection.variant.name,
      value: selection.variant.value,
      priceModifier: selection.variant.priceModifier ?? 0,
      quantity: selection.variant.quantity,
      weight: selection.variant.weight,
      dimensions: selection.variant.dimensions,
      sku: selection.variant.sku,
    }))

  const calculateTotalPrice = () => {
    const basePrice = product.price
    const variantPriceModifier = selectedVariants.reduce(
      (total, variant) => total + variant.priceModifier,
      0,
    )
    return basePrice + variantPriceModifier
  }

  const handleVariantQuantityChange = useCallback(
    (variantType: string, variant: NonNullable<Product['variants']>[0], quantity: number) => {
      const key = `${variantType}-${variant.value}`
      setVariantSelections((prev) => ({
        ...prev,
        [key]: {
          variant,
          quantity: Math.max(0, quantity),
        },
      }))
    },
    [],
  )

  const getVariantQuantity = (variantType: string, value: string) => {
    const key = `${variantType}-${value}`
    return variantSelections[key]?.quantity || 0
  }

  const updateStock = async (productId: string, quantityChange: number, variantId?: string) => {
    try {
      const response = await fetch('/api/products/update-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          variantId,
          quantityChange: -quantityChange, // Negative to reduce stock
        }),
      })

      if (!response.ok) {
        console.error('Failed to update stock')
      }
    } catch (error) {
      console.error('Error updating stock:', error)
    }
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    
    try {
      // Add each selected variant separately to cart
      for (const selection of Object.values(variantSelections)) {
        if (selection.quantity > 0) {
          const variant: CartVariant = {
            name: selection.variant.name,
            value: selection.variant.value,
            priceModifier: selection.variant.priceModifier ?? 0,
            quantity: selection.variant.quantity,
            weight: selection.variant.weight,
            dimensions: selection.variant.dimensions,
            sku: selection.variant.sku,
          }
          addToCart(product, [variant], selection.quantity)

          // Update stock if tracking is enabled
          if (product.trackQuantity) {
            await updateStock(
              product.id.toString(),
              selection.quantity,
              selection.variant.id || undefined,
            )
          }
        }
      }

      // Add base product if quantity > 0
      if (quantity > 0) {
        addToCart(product, [], quantity)

        // Update stock for base product
        if (product.trackQuantity) {
          await updateStock(product.id.toString(), quantity)
        }
      }

      // Reset form
      resetForm()
    } catch (error) {
      console.error('Error adding to cart:', error)
      // Optionally show an error message to the user
    } finally {
      setIsAddingToCart(false)
    }
  }

  const resetForm = () => {
    // Reset all variant quantities to 0
    setVariantSelections((prev) => {
      const reset = { ...prev }
      Object.keys(reset).forEach((key) => {
        reset[key] = { ...reset[key], quantity: 0 }
      })
      return reset
    })
    setQuantity(0)
  }

  const _totalPrice = calculateTotalPrice()
  const itemInCart = isInCart(product.id, selectedVariants)
  const cartItem = getCartItem(product.id, selectedVariants)

  // Get effective properties based on selected variants
  const effectiveQuantity = getEffectiveQuantity(product, selectedVariants)
  const _effectiveWeight = getEffectiveWeight(product, selectedVariants)
  const _effectiveDimensions = getEffectiveDimensions(product, selectedVariants)
  const _effectiveSku = getEffectiveSku(product, selectedVariants)

  const isOutOfStock = Boolean(
    product.trackQuantity && effectiveQuantity !== null && effectiveQuantity <= 0,
  )

  const QuantityControl = ({
    value,
    onChange,
    max,
    disabled = false,
    id,
  }: {
    value: number
    onChange: (value: number) => void
    max?: number
    disabled?: boolean
    id?: string
  }) => (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 shrink-0"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={disabled || value <= 0}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input
        id={id}
        type="number"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
        className="w-16 text-center h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
        disabled={disabled}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 shrink-0"
        onClick={() => onChange(value + 1)}
        disabled={disabled || (max !== undefined && value >= max)}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Product Selection */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Select Options</h3>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Base Product */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="space-y-2">
              <div className="font-medium text-sm">{product.title}</div>
              <div className="text-xs text-gray-600">Base Product</div>
              <div className="text-sm text-green-600 font-medium">{formatPrice(product.price)}</div>
              {product.trackQuantity && effectiveQuantity !== null && (
                <div className="text-xs text-gray-500">
                  {effectiveQuantity > 0 ? (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Stock: {effectiveQuantity}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Quantity:</Label>
              <QuantityControl
                value={quantity}
                onChange={setQuantity}
                max={product.trackQuantity ? effectiveQuantity || undefined : undefined}
                disabled={Boolean(
                  product.trackQuantity && effectiveQuantity !== null && effectiveQuantity <= 0,
                )}
                id="quantity"
              />
            </div>
          </div>

          {/* Variants */}
          {Object.entries(groupedVariants).map(([variantType, variants]) =>
            variants.map((variant, index) => {
              const currentQuantity = getVariantQuantity(variantType, variant.value)
              const maxQuantity = variant.quantity || product.quantity || 999
              const isVariantOutOfStock = Boolean(
                product.trackQuantity && maxQuantity !== null && maxQuantity <= 0,
              )

              return (
                <div key={`${variantType}-${index}`} className="border rounded-lg p-4 space-y-3">
                  <div className="space-y-2">
                    <div className="font-medium text-sm">{variant.value}</div>
                    <div className="text-xs text-gray-600">{variantType}</div>
                    <div className="text-sm text-green-600 font-medium">
                      {formatPrice(product.price + (variant.priceModifier ?? 0))}
                      {variant.priceModifier !== undefined &&
                        variant.priceModifier !== null &&
                        variant.priceModifier !== 0 && (
                          <span className="text-xs text-gray-600 ml-1">
                            ({variant.priceModifier > 0 ? '+' : ''}
                            {formatPrice(variant.priceModifier)})
                          </span>
                        )}
                    </div>
                    {product.trackQuantity && maxQuantity !== null && (
                      <div className="text-xs">
                        {maxQuantity > 0 ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Stock: {maxQuantity}
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Out of Stock</Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Quantity:</Label>
                    <QuantityControl
                      value={currentQuantity}
                      onChange={(value) => handleVariantQuantityChange(variantType, variant, value)}
                      max={product.trackQuantity ? maxQuantity || undefined : undefined}
                      disabled={isVariantOutOfStock}
                      id={`quantity-${variantType}-${index}`}
                    />
                  </div>
                </div>
              )
            }),
          )}
        </div>
      </div>

      {/* Price Display */}
      <div className="space-y-2">
        <div className="space-y-3">
          {/* Base Product Price */}
          {quantity > 0 && (
            <div className="flex items-baseline gap-4">
              <span className="text-lg font-semibold text-gray-900">
                Base Product: {formatPrice(product.price)}
              </span>
              {quantity > 1 && (
                <span className="text-sm text-gray-600">
                  × {quantity} = {formatPrice(product.price * quantity)}
                </span>
              )}
            </div>
          )}

          {/* Selected Variants Price */}
          {Object.values(variantSelections).some((s) => s.quantity > 0) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Selected Variants:</h4>
              {Object.values(variantSelections)
                .filter((s) => s.quantity > 0)
                .map((selection, idx) => {
                  const variantPrice = product.price + (selection.variant.priceModifier ?? 0)
                  return (
                    <div key={idx} className="flex items-baseline justify-between text-sm">
                      <span>
                        {selection.variant.name}: {selection.variant.value}
                      </span>
                      <span>
                        {formatPrice(variantPrice)} × {selection.quantity} ={' '}
                        {formatPrice(variantPrice * selection.quantity)}
                      </span>
                    </div>
                  )
                })}
            </div>
          )}

          {/* Total Price */}
          {(quantity > 0 || Object.values(variantSelections).some((s) => s.quantity > 0)) && (
            <div className="pt-2 border-t">
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(
                    product.price * quantity +
                      Object.values(variantSelections)
                        .filter((s) => s.quantity > 0)
                        .reduce((total, selection) => {
                          const variantPrice =
                            product.price + (selection.variant.priceModifier ?? 0)
                          return total + variantPrice * selection.quantity
                        }, 0),
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cart Status */}
      {itemInCart && cartItem && (
        <Badge variant="outline" className="text-green-600">
          In Cart: {cartItem.quantity} item{cartItem.quantity > 1 ? 's' : ''}
        </Badge>
      )}

      {/* Variant Properties Display */}
      {/* {selectedVariants.length > 0 && (
        <div className="space-y-2 border-t pt-4">
          <h4 className="font-medium text-sm">Selected Configuration:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            {effectiveWeight && (
              <div>Weight: {effectiveWeight}g</div>
            )}
            {effectiveDimensions && (effectiveDimensions.length || effectiveDimensions.width || effectiveDimensions.height) && (
              <div>
                Dimensions: 
                {effectiveDimensions.length && ` L: ${effectiveDimensions.length}cm`}
                {effectiveDimensions.width && ` W: ${effectiveDimensions.width}cm`}
                {effectiveDimensions.height && ` H: ${effectiveDimensions.height}cm`}
              </div>
            )}
            {effectiveSku && (
              <div>SKU: {effectiveSku}</div>
            )}
          </div>
        </div>
      )} */}

      {/* Stock Status */}
      {/* {product.trackQuantity && effectiveQuantity !== null && (
        <div className="text-sm text-gray-600">
          {effectiveQuantity > 0 ? (
            <span>In Stock: {effectiveQuantity} available</span>
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>
      )} */}

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={
          isAddingToCart ||
          isOutOfStock ||
          (quantity === 0 && !Object.values(variantSelections).some((s) => s.quantity > 0))
        }
        className="w-full"
        size="lg"
      >
        {isAddingToCart ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Adding to Cart...
          </div>
        ) : isOutOfStock ? (
          'Out of Stock'
        ) : quantity === 0 && !Object.values(variantSelections).some((s) => s.quantity > 0) ? (
          'Select Items to Add'
        ) : (
          'Add to Cart'
        )}
      </Button>
    </div>
  )
}
