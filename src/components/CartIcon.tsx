'use client'
// src/components/CartIcon.tsx
import { useState } from 'react'
import { useShoppingCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Minus, Plus, ShoppingCart, Trash } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { formatPrice } from '@/lib/formatHelpers'
// import { getEffectiveWeight, getEffectiveDimensions, getEffectiveSku } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

export function CartIcon() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useShoppingCart()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {cart.totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {cart.totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[40vw] p-5">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {cart.totalItems === 0 ? 'Your cart is empty' : `${cart.totalItems} items in cart`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {cart.items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cart.items.map((item) => {
                  const primaryImage = item.product.images?.[0]
                  const imageUrl =
                    typeof primaryImage?.image === 'object' ? primaryImage.image?.url : ''

                  // Get effective properties for this cart item
                  // const effectiveWeight = getEffectiveWeight(item.product, item.variants)
                  // const effectiveDimensions = getEffectiveDimensions(item.product, item.variants)
                  // const effectiveSku = getEffectiveSku(item.product, item.variants)

                  return (
                    <div key={item.id} className="flex gap-3 border-b pb-4">
                      {imageUrl && (
                        <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100">
                          <Image
                            src={imageUrl}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium text-sm">{item.product.title}</h4>

                        {item.variants.length > 0 && (
                          <div className="text-xs text-gray-600 space-y-1">
                            {item.variants
                              .map((variant) => `${variant.name}: ${variant.value}`)
                              .join(', ')}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{formatPrice(item.basePrice)}</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4 text-primary" />
                            </Button>
                            <span className="text-sm w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4 text-primary" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">
                            {formatPrice(item.totalPrice)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total: {formatPrice(cart.totalPrice)}</span>
                </div>

                <div className="flex flex-row gap-2">
                  <Link href="/checkout" onClick={() => setOpen(false)}>
                    <Button className="w-full" size="lg">
                      Checkout
                    </Button>
                  </Link>
                  <Button variant="destructive" size="lg" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
