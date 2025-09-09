import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    return null
  }

  try {
    const payload = await getPayload({ config })
    
    // Decode JWT token to get user ID
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const decoded = JSON.parse(jsonPayload)

    if (!decoded.id) {
      return null
    }

    // Get user from database
    const user = await payload.findByID({
      collection: 'users',
      id: decoded.id,
    })

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function requireAdmin() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/admin')
  }
  
  return user
}

export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.role === 'admin'
}