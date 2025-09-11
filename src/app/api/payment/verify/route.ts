// src/app/api/payment/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { getPayload } from 'payload'
import config from '@/payload.config'

interface CartItem {
  productId?: number
  id?: number
  price?: number
  basePrice?: number
  totalPrice?: number
  quantity: number | string
}

export async function POST(request: NextRequest) {
  // Initialize Razorpay inside the function to avoid build-time errors
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: 'Razorpay configuration is missing' },
      { status: 500 }
    )
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
  try {
    const body = await request.json()

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartDetails,
      customerDetails,
      customer,
      shippingAddress,
      billingAddress,
    } = body

    const finalCustomerDetails = customerDetails || customer

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment verification fields' },
        { status: 400 },
      )
    }

    // Validate required order data
    const missingCustomerFields = []
    if (!finalCustomerDetails) {
      missingCustomerFields.push('customerDetails/customer object is missing')
    } else {
      if (!finalCustomerDetails.email) missingCustomerFields.push('email')
      if (!finalCustomerDetails.firstName) missingCustomerFields.push('firstName')
      if (!finalCustomerDetails.lastName) missingCustomerFields.push('lastName')
    }

    if (missingCustomerFields.length > 0) {
      return NextResponse.json(
        {
          error: 'Missing required customer details',
          missingFields: missingCustomerFields,
        },
        { status: 400 },
      )
    }

    if (
      !shippingAddress?.address1 ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.postalCode
    ) {
      return NextResponse.json(
        { error: 'Missing required shipping address details' },
        { status: 400 },
      )
    }

    if (!cartDetails?.items || cartDetails.items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required' }, { status: 400 })
    }

    // Validate cart items
    for (let i = 0; i < cartDetails.items.length; i++) {
      const item = cartDetails.items[i]
      if (!item.productId && !item.id) {
        return NextResponse.json(
          { error: `Cart item ${i + 1} is missing product ID` },
          { status: 400 },
        )
      }

      const itemPrice = item.price || item.basePrice || item.totalPrice || 0
      if (!itemPrice || itemPrice <= 0) {
        return NextResponse.json(
          { error: `Cart item ${i + 1} is missing valid price` },
          { status: 400 },
        )
      }

      if (!item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { error: `Cart item ${i + 1} is missing valid quantity` },
          { status: 400 },
        )
      }
    }

    // Create signature for verification
    const body_string = razorpay_order_id + '|' + razorpay_payment_id
    const expected_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body_string)
      .digest('hex')

    // Verify signature
    const is_signature_valid = expected_signature === razorpay_signature

    if (!is_signature_valid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Declare orderData variable in scope accessible to both try and catch blocks
    let orderData: any

    // Fetch payment details from Razorpay
    try {
      const payment = await razorpay.payments.fetch(razorpay_payment_id)
      const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id)

      console.log('Payment details:', {
        id: payment.id,
        status: payment.status,
        amount: payment.amount
      })

      // Initialize Payload
      let payload
      try {
        console.log('Initializing Payload...')
        payload = await getPayload({ config })
        console.log('Payload initialized successfully')
      } catch (payloadInitError) {
        console.error('Failed to initialize Payload:', payloadInitError)
        throw new Error(`Database connection failed: ${payloadInitError instanceof Error ? payloadInitError.message : 'Unknown error'}`)
      }


      // Calculate order totals
      const subtotal =
        cartDetails?.items?.reduce((sum: number, item: CartItem) => {
          // Use the available price field (basePrice for unit price, totalPrice for item total)
          const itemQuantity =
            typeof item.quantity === 'string' ? parseInt(item.quantity) || 0 : (item.quantity || 0)
          const unitPrice =
            item.basePrice ||
            item.price ||
            (item.totalPrice && itemQuantity > 0 ? item.totalPrice / itemQuantity : 0) ||
            0
          return sum + (Number(unitPrice) || 0) * (Number(itemQuantity) || 0)
        }, 0) || 0

      const tax =
        typeof cartDetails?.tax === 'string' ? (parseFloat(cartDetails.tax) || 0) : (Number(cartDetails?.tax) || 0)
      const shippingCost =
        typeof cartDetails?.shippingCost === 'string'
          ? (parseFloat(cartDetails.shippingCost) || 0)
          : (Number(cartDetails?.shippingCost) || 0)
      const discount =
        typeof cartDetails?.discount === 'string'
          ? (parseFloat(cartDetails.discount) || 0)
          : (Number(cartDetails?.discount) || 0)
      const total = subtotal + tax + shippingCost - discount

      // Generate unique order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      // Prepare order data with proper type handling and validation
      orderData = {
        orderNumber,
        customer: {
          email: finalCustomerDetails.email,
          firstName: finalCustomerDetails.firstName,
          lastName: finalCustomerDetails.lastName,
          phone: finalCustomerDetails.phone || '',
        },
        items: (cartDetails?.items || []).map((item: CartItem) => {
          const itemQuantity = typeof item.quantity === 'string' ? (parseInt(item.quantity) || 0) : (item.quantity || 0)
          const unitPrice = item.basePrice || item.price || (item.totalPrice && itemQuantity > 0 ? item.totalPrice / itemQuantity : 0) || 0
          
          // Ensure we have a valid product ID
          const productId = item.productId || item.id
          if (!productId) {
            throw new Error(`Missing product ID for item: ${JSON.stringify(item)}`)
          }
          
          return {
            product: productId,
            quantity: Number(itemQuantity),
            price: Number(unitPrice),
            total: Number((Number(unitPrice) || 0) * (Number(itemQuantity) || 0)),
          }
        }),
        shipping: {
          address1: shippingAddress.address1,
          address2: shippingAddress.address2 || '',
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country || 'India',
        },
        billing: {
          sameAsShipping: billingAddress?.sameAsShipping ?? true,
          address1: billingAddress?.address1 || '',
          address2: billingAddress?.address2 || '',
          city: billingAddress?.city || '',
          state: billingAddress?.state || '',
          postalCode: billingAddress?.postalCode || '',
          country: billingAddress?.country || 'India',
        },
        subtotal: Number(subtotal),
        tax: Number(tax),
        shipping_cost: Number(shippingCost),
        discount: Number(discount),
        total: Number(total),
        paymentMethod: 'razorpay' as const,
        payment: {
          razorpayOrderId: razorpayOrder.id,
          razorpayPaymentId: payment.id,
          razorpaySignature: razorpay_signature,
          paymentStatus: payment.status === 'captured' ? 'captured' as const : payment.status === 'authorized' ? 'authorized' as const : payment.status === 'failed' ? 'failed' as const : payment.status === 'refunded' ? 'refunded' as const : 'pending' as const,
          paymentMethod: payment.method || '',
          paymentDate: new Date(payment.created_at * 1000),
          amount: Number(payment.amount),
        },
        paymentId: payment.id,
        status: payment.status === 'captured' ? 'processing' as const : 'pending' as const,
        notes: `Payment completed via Razorpay. Method: ${payment.method}`,
      }
      
      // Validate critical order data before creating
      if (!orderData.customer.email || !orderData.customer.firstName || !orderData.customer.lastName) {
        throw new Error('Missing required customer information')
      }
      
      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Order must contain at least one item')
      }
      
      if (!orderData.shipping.address1 || !orderData.shipping.city || !orderData.shipping.state || !orderData.shipping.postalCode) {
        throw new Error('Missing required shipping address information')
      }
      
      // Validate that the calculated total matches the Razorpay payment amount
      const razorpayAmountInRupees = Number(payment.amount) / 100 // Razorpay amount is in paise
      const orderTotalInRupees = total
      
      console.log('Amount validation:', {
        razorpayAmountInRupees,
        orderTotalInRupees,
        difference: Math.abs(razorpayAmountInRupees - orderTotalInRupees)
      })
      
      // Allow a small tolerance for rounding differences (1 rupee)
      if (Math.abs(razorpayAmountInRupees - orderTotalInRupees) > 1) {
        throw new Error(`Order total mismatch: Razorpay amount ₹${razorpayAmountInRupees} vs calculated total ₹${orderTotalInRupees}`)
      }

      console.log('Creating order with data:', JSON.stringify(orderData, null, 2))

      // Create order in Payload with detailed error handling
      let createdOrder
      try {
        console.log('Attempting to create order in Payload...')
        createdOrder = await payload.create({
          collection: 'orders',
          data: orderData,
        })
        console.log('Order created successfully:', createdOrder.id)
      } catch (payloadError) {
        console.error('Payload order creation failed:', payloadError)
        
        if (payloadError instanceof Error) {
          console.error('Payload error message:', payloadError.message)
          console.error('Payload error stack:', payloadError.stack)
        }
        
        // Re-throw with more context
        throw new Error(`Failed to create order in database: ${payloadError instanceof Error ? payloadError.message : 'Unknown Payload error'}`)
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified and order created successfully',
        order: {
          id: createdOrder.id,
          orderNumber: createdOrder.orderNumber,
          status: createdOrder.status,
          total: createdOrder.total,
        },
        payment: {
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          method: payment.method,
          created_at: payment.created_at,
        },
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          status: razorpayOrder.status,
          receipt: razorpayOrder.receipt,
        },
      })
    } catch (paymentError) {
      console.error('Error processing payment and creating order:', paymentError)
      
      // Log the full error details for debugging
      if (paymentError instanceof Error) {
        console.error('Error message:', paymentError.message)
        console.error('Error stack:', paymentError.stack)
      }
      
      // Log the order data that was trying to be created (if available)
      if (typeof orderData !== 'undefined') {
        console.error('Order data that failed:', JSON.stringify(orderData, null, 2))
      }
      
      return NextResponse.json(
        {
          error: 'Failed to process payment and create order',
          details: paymentError instanceof Error ? paymentError.message : 'Unknown error',
          debug: process.env.NODE_ENV === 'development' ? {
            message: paymentError instanceof Error ? paymentError.message : 'Unknown error',
            stack: paymentError instanceof Error ? paymentError.stack : undefined,
            orderData: orderData || null
          } : undefined
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Error verifying payment:', error)

    return NextResponse.json(
      {
        error: 'Payment verification failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
