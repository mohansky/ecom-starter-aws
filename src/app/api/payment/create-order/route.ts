import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = 'INR', receipt, notes, cartDetails } = body

    // Validate required fields
    if (!amount || !receipt) {
      return NextResponse.json(
        { error: 'Amount and receipt are required' },
        { status: 400 }
      )
    }

    // Validate amount (should be in paise for INR)
    const amountInPaise = Math.round(amount * 100)
    
    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: 'Amount should be at least ₹1' },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt,
      notes: {
        ...notes,
        cart_items: JSON.stringify(cartDetails?.items || []),
        total_items: cartDetails?.totalItems?.toString() || '0',
      },
    })

    // Return order details
    return NextResponse.json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        amount_paid: razorpayOrder.amount_paid,
        amount_due: razorpayOrder.amount_due,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        status: razorpayOrder.status,
        created_at: razorpayOrder.created_at,
      },
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}