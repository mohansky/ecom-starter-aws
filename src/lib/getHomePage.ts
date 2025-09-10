// src/lib/getHomePage.ts
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getHomePage() {
  // Skip database operations during build
  if (process.env.SKIP_BUILD_DATABASE) {
    return {
      hero: {
        title: 'Welcome to Our Store',
        subtitle: 'Discover amazing products and unbeatable deals',
        ctaButton: {
          text: 'Shop Now',
          type: 'link' as const,
          url: '/products',
        },
      },
      textWithImage: { enabled: false },
      featuredProducts: { enabled: false },
      featuredCategories: { enabled: false },
    }
  }

  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const homePage = await payload.findGlobal({
      slug: 'homePage',
      depth: 2,
    })

    return homePage
  } catch (error) {
    console.error('Error fetching home page:', error)
    return {
      hero: {
        title: 'Welcome to Our Store',
        subtitle: 'Discover amazing products and unbeatable deals',
        ctaButton: {
          text: 'Shop Now',
          type: 'link' as const,
          url: '/products',
        },
      },
      textWithImage: { enabled: false },
      featuredProducts: { enabled: false },
      featuredCategories: { enabled: false },
    }
  }
}
