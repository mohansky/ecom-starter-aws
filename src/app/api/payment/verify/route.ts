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

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
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

    // Fetch payment details from Razorpay
    try {
      const payment = await razorpay.payments.fetch(razorpay_payment_id)
      const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id)

      // Initialize Payload
      const payload = await getPayload({ config })

      // Calculate order totals
      const subtotal =
        cartDetails?.items?.reduce((sum: number, item: CartItem) => {
          // Use the available price field (basePrice for unit price, totalPrice for item total)
          const itemQuantity =
            typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity
          const unitPrice =
            item.basePrice ||
            item.price ||
            (item.totalPrice ? item.totalPrice / itemQuantity : 0) ||
            0
          return sum + unitPrice * itemQuantity
        }, 0) || 0

      const tax =
        typeof cartDetails?.tax === 'string' ? parseFloat(cartDetails.tax) : cartDetails?.tax || 0
      const shippingCost =
        typeof cartDetails?.shippingCost === 'string'
          ? parseFloat(cartDetails.shippingCost)
          : cartDetails?.shippingCost || 0
      const discount =
        typeof cartDetails?.discount === 'string'
          ? parseFloat(cartDetails.discount)
          : cartDetails?.discount || 0
      const total = subtotal + tax + shippingCost - discount

      // Generate unique order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      // Create order in Payload
      const createdOrder = await payload.create({
        collection: 'orders',
        data: {
          orderNumber,
          customer: {
            email: finalCustomerDetails.email,
            firstName: finalCustomerDetails.firstName,
            lastName: finalCustomerDetails.lastName,
            phone: finalCustomerDetails.phone || '',
          },
          items:
            cartDetails?.items?.map((item: CartItem) => {
              // Use the correct price field from your cart structure
              const itemQuantity =
                typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity
              const unitPrice =
                item.basePrice ||
                item.price ||
                (item.totalPrice ? item.totalPrice / itemQuantity : 0) ||
                0
              return {
                product: item.productId || item.id,
                quantity: itemQuantity,
                price: unitPrice,
                total: unitPrice * itemQuantity,
              }
            }) || [],
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
          subtotal,
          tax,
          shipping_cost: shippingCost,
          discount,
          total,
          paymentMethod: 'razorpay',
          payment: {
            razorpayOrderId: razorpayOrder.id,
            razorpayPaymentId: payment.id,
            razorpaySignature: razorpay_signature,
            paymentStatus:
              payment.status === 'captured'
                ? 'captured'
                : payment.status === 'authorized'
                  ? 'authorized'
                  : payment.status === 'failed'
                    ? 'failed'
                    : payment.status === 'refunded'
                      ? 'refunded'
                      : 'pending',
            paymentMethod: payment.method || '',
            paymentDate: new Date(payment.created_at * 1000).toISOString(),
            amount: typeof payment.amount === 'string' ? parseInt(payment.amount) : payment.amount,
          },
          paymentId: payment.id,
          status: payment.status === 'captured' ? 'processing' : 'pending',
          notes: `Payment completed via Razorpay. Method: ${payment.method}`,
        },
      })

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
      return NextResponse.json(
        {
          error: 'Failed to process payment and create order',
          details: paymentError instanceof Error ? paymentError.message : 'Unknown error',
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
