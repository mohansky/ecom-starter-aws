// src/app/api/orders/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status, notes } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Valid order statuses
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ') },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Check if order exists
    const existingOrder = await payload.findByID({
      collection: 'orders',
      id,
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order status
    const updatedOrder = await payload.update({
      collection: 'orders',
      id,
      data: {
        status,
        ...(notes && { 
          notes: existingOrder.notes 
            ? `${existingOrder.notes}\n\n[${new Date().toISOString()}] Status changed to ${status}: ${notes}`
            : `[${new Date().toISOString()}] Status changed to ${status}: ${notes}`
        }),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        notes: updatedOrder.notes,
        updatedAt: updatedOrder.updatedAt,
      },
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update order status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}