// src/app/api/payment/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')
    
    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    if (!signature) {
      console.error('Missing webhook signature')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Parse webhook payload
    const payload = JSON.parse(body)
    const { event, contains, entity } = payload

    console.log('Received webhook:', { event, entity: entity?.id })

    // Initialize Payload CMS
    const payloadCMS = await getPayload({ config })

    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payloadCMS, entity)
        break
      
      case 'payment.failed':
        await handlePaymentFailed(payloadCMS, entity)
        break
      
      case 'payment.authorized':
        await handlePaymentAuthorized(payloadCMS, entity)
        break
      
      case 'order.paid':
        await handleOrderPaid(payloadCMS, entity)
        break
      
      default:
        console.log(`Unhandled webhook event: ${event}`)
    }

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

async function handlePaymentCaptured(payload: any, payment: any) {
  try {
    console.log('Processing payment.captured:', payment.id)
    
    // Find order by payment ID
    const orders = await payload.find({
      collection: 'orders',
      where: {
        paymentId: { equals: payment.id }
      }
    })

    if (orders.docs.length === 0) {
      console.error(`No order found for payment ID: ${payment.id}`)
      return
    }

    const order = orders.docs[0]
    
    // Update order status to confirmed/processing
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        status: 'processing',
        'payment.paymentStatus': 'captured',
        notes: `${order.notes || ''}\nPayment captured via webhook: ${payment.id}`
      }
    })

    console.log(`Order ${order.id} updated - payment captured`)
  } catch (error) {
    console.error('Error handling payment.captured:', error)
  }
}

async function handlePaymentFailed(payload: any, payment: any) {
  try {
    console.log('Processing payment.failed:', payment.id)
    
    // Find order by payment ID
    const orders = await payload.find({
      collection: 'orders',
      where: {
        paymentId: { equals: payment.id }
      }
    })

    if (orders.docs.length === 0) {
      console.error(`No order found for payment ID: ${payment.id}`)
      return
    }

    const order = orders.docs[0]
    
    // Update order status to failed
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        status: 'failed',
        'payment.paymentStatus': 'failed',
        notes: `${order.notes || ''}\nPayment failed via webhook: ${payment.id}. Reason: ${payment.error_reason || 'Unknown'}`
      }
    })

    console.log(`Order ${order.id} updated - payment failed`)
  } catch (error) {
    console.error('Error handling payment.failed:', error)
  }
}

async function handlePaymentAuthorized(payload: any, payment: any) {
  try {
    console.log('Processing payment.authorized:', payment.id)
    
    // Find order by payment ID
    const orders = await payload.find({
      collection: 'orders',
      where: {
        paymentId: { equals: payment.id }
      }
    })

    if (orders.docs.length === 0) {
      console.error(`No order found for payment ID: ${payment.id}`)
      return
    }

    const order = orders.docs[0]
    
    // Update order status to authorized (waiting for capture)
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        status: 'pending',
        'payment.paymentStatus': 'authorized',
        notes: `${order.notes || ''}\nPayment authorized via webhook: ${payment.id}`
      }
    })

    console.log(`Order ${order.id} updated - payment authorized`)
  } catch (error) {
    console.error('Error handling payment.authorized:', error)
  }
}

async function handleOrderPaid(payload: any, order: any) {
  try {
    console.log('Processing order.paid:', order.id)
    
    // Find order by Razorpay order ID
    const orders = await payload.find({
      collection: 'orders',
      where: {
        'payment.razorpayOrderId': { equals: order.id }
      }
    })

    if (orders.docs.length === 0) {
      console.error(`No order found for Razorpay order ID: ${order.id}`)
      return
    }

    const dbOrder = orders.docs[0]
    
    // Update order status to completed
    await payload.update({
      collection: 'orders',
      id: dbOrder.id,
      data: {
        status: 'processing',
        notes: `${dbOrder.notes || ''}\nOrder marked as paid via webhook: ${order.id}`
      }
    })

    console.log(`Order ${dbOrder.id} updated - order paid`)
  } catch (error) {
    console.error('Error handling order.paid:', error)
  }
}