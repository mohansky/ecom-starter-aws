// src/lib/getNavigation.ts
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getNavigation() {
  const payload = await getPayload({ config })

  try {
    const navigation = await payload.findGlobal({
      slug: 'navigation',
    })

    return navigation
  } catch (error) {
    console.error('Error fetching navigation:', error)
    return { mainNav: [], footerNav: [], socialLinks: [] }
  }
}
