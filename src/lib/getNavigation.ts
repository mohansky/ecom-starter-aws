// src/lib/getNavigation.ts
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getNavigation() {
  // Skip database operations during build
  if (process.env.SKIP_BUILD_DATABASE) {
    return { mainNav: [], footerNav: [], socialLinks: [] }
  }

  try {
    const payload = await getPayload({ config })

    const navigation = await payload.findGlobal({
      slug: 'navigation',
    })

    return navigation
  } catch (error) {
    console.error('Error fetching navigation:', error)
    return { mainNav: [], footerNav: [], socialLinks: [] }
  }
}
