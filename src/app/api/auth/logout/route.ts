import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Clear the payload authentication cookie
    cookieStore.delete('payload-token')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ success: false, error: 'Failed to logout' }, { status: 500 })
  }
}