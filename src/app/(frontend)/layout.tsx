// src/app/(frontend)/layout.tsx
import React from 'react'
import '@/globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { getNavigation } from '@/lib/getNavigation'
import { CartProvider } from '@/contexts/CartContext'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const navigation = await getNavigation()

  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar navigation={navigation} />
            <main className="flex-grow">{children}</main>
            <Footer navigation={navigation} />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
