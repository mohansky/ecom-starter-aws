import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('=== Debug Route Called ===')
    
    // Check environment variables
    const envCheck = {
      PAYLOAD_SECRET: !!process.env.PAYLOAD_SECRET,
      DATABASE_URI: !!process.env.DATABASE_URI,
      DATABASE_AUTH_TOKEN: !!process.env.DATABASE_AUTH_TOKEN,
      R2_BUCKET: !!process.env.R2_BUCKET,
      R2_ACCESS_KEY_ID: !!process.env.R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY: !!process.env.R2_SECRET_ACCESS_KEY,
      R2_ENDPOINT: !!process.env.R2_ENDPOINT,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      RESEND_FROM_EMAIL: !!process.env.RESEND_FROM_EMAIL,
    }
    
    console.log('Environment Variables:', envCheck)
    
    // Try to import payload config
    try {
      const { default: config } = await import('@/payload.config')
      console.log('Payload config loaded successfully')
      console.log('Config has collections:', !!config.collections)
      console.log('Config has admin:', !!config.admin)
      console.log('Config has db:', !!config.db)
    } catch (configError) {
      console.error('Payload config error:', configError)
      return NextResponse.json({ 
        error: 'Payload config failed to load',
        details: configError.message 
      }, { status: 500 })
    }
    
    // Try to test database connection
    try {
      const payload = await import('payload')
      console.log('Payload imported successfully')
    } catch (payloadError) {
      console.error('Payload import error:', payloadError)
      return NextResponse.json({ 
        error: 'Payload import failed',
        details: payloadError.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      status: 'Debug successful',
      environment: envCheck,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Debug route error:', error)
    return NextResponse.json({ 
      error: 'Debug failed',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}