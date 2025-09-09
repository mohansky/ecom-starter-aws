// src/components/OrderStatusEditor.tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Edit, Clock, Truck, CheckCircle2, XCircle, AlertCircle, Package } from 'lucide-react'
// Using simple alerts for notifications

interface OrderStatusEditorProps {
  orderId: string | number
  currentStatus: string
  orderNumber: string
  onStatusUpdate?: (newStatus: string) => void
}

const statusConfig = {
  pending: {
    variant: 'secondary' as const,
    label: 'Pending',
    icon: Clock,
    description: 'Order is pending confirmation',
  },
  processing: {
    variant: 'default' as const,
    label: 'Processing',
    icon: Package,
    description: 'Order is being processed',
  },
  shipped: {
    variant: 'success' as const,
    label: 'Shipped',
    icon: Truck,
    description: 'Order has been shipped',
  },
  delivered: {
    variant: 'success' as const,
    label: 'Delivered',
    icon: CheckCircle2,
    description: 'Order has been delivered',
  },
  cancelled: {
    variant: 'destructive' as const,
    label: 'Cancelled',
    icon: XCircle,
    description: 'Order has been cancelled',
  },
  refunded: {
    variant: 'destructive' as const,
    label: 'Refunded',
    icon: AlertCircle,
    description: 'Order has been refunded',
  },
}

export function OrderStatusEditor({
  orderId,
  currentStatus,
  orderNumber,
  onStatusUpdate,
}: OrderStatusEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const config = statusConfig[currentStatus as keyof typeof statusConfig] || statusConfig.pending
  const IconComponent = config.icon

  const handleStatusUpdate = async () => {
    if (selectedStatus === currentStatus) {
      setIsOpen(false)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/orders/${orderId.toString()}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: selectedStatus,
          notes: notes.trim() || `Status updated from ${currentStatus} to ${selectedStatus}`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update order status')
      }

      if (data.success) {
        alert(`Order ${orderNumber} status updated to ${selectedStatus}`)
        onStatusUpdate?.(selectedStatus)
        setIsOpen(false)
        setNotes('')

        // Refresh the page to show updated data
        window.location.reload()
      } else {
        throw new Error(data.error || 'Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert(
        error instanceof Error ? error.message : 'Failed to update order status. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusWorkflow = (current: string) => {
    const workflows = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'cancelled'],
      delivered: ['refunded'],
      cancelled: ['processing'], // Can reactivate cancelled orders
      refunded: [], // Final state
    }
    return workflows[current as keyof typeof workflows] || []
  }

  const availableStatuses = [currentStatus, ...getStatusWorkflow(currentStatus)]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer group">
          <Badge variant={config.variant} className="group-hover:opacity-80">
            <IconComponent className="mr-1 h-3 w-3" />
            {config.label}
            <Edit className="ml-1 h-3 w-3" />
          </Badge>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Order Number</Label>
            <p className="text-sm text-muted-foreground">{orderNumber}</p>
          </div>

          <div>
            <Label className="text-sm font-medium">Current Status</Label>
            <div className="mt-1">
              <Badge variant={config.variant}>
                <IconComponent className="mr-1 h-3 w-3" />
                {config.label}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-select">New Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((status) => {
                  const statusConf = statusConfig[status as keyof typeof statusConfig]
                  const StatusIcon = statusConf.icon
                  return (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" />
                        <span>{statusConf.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            {selectedStatus && selectedStatus !== currentStatus && (
              <p className="text-xs text-muted-foreground">
                {statusConfig[selectedStatus as keyof typeof statusConfig]?.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add a note about this status change..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false)
              setSelectedStatus(currentStatus)
              setNotes('')
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStatusUpdate}
            disabled={isLoading || selectedStatus === currentStatus}
          >
            {isLoading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
