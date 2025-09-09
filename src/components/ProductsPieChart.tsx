'use client'
// src/components/ProductsPieChart.tsx
import { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, PieChart as _PieChart, Package } from 'lucide-react'
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns'
import { cn } from '@/lib/utils'
import { DateRange } from 'react-day-picker'
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { Order, Product } from '@/payload-types'

interface ProductsPieChartProps {
  orders: Order[]
}

type TimePeriod = '7d' | '30d' | '90d' | 'custom'

interface ProductData {
  name: string
  value: number
  color: string
}

// Color palette for products
const COLORS = [
  '#f59e0b', // Amber
  '#10b981', // Green
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#ec4899', // Pink
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#f43f5e', // Rose
]

export function ProductsPieChart({ orders }: ProductsPieChartProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30d')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const getDateRange = useCallback((period: TimePeriod): { from: Date; to: Date } => {
    const now = new Date()
    const to = endOfDay(now)

    switch (period) {
      case '7d':
        return { from: startOfDay(subDays(now, 6)), to }
      case '30d':
        return { from: startOfDay(subDays(now, 29)), to }
      case '90d':
        return { from: startOfDay(subDays(now, 89)), to }
      case 'custom':
        return {
          from: dateRange?.from ? startOfDay(dateRange.from) : startOfDay(subDays(now, 29)),
          to: dateRange?.to ? endOfDay(dateRange.to) : to,
        }
      default:
        return { from: startOfDay(subDays(now, 29)), to }
    }
  }, [dateRange])

  const chartData = useMemo(() => {
    const { from, to } = getDateRange(timePeriod)

    // Filter orders within the date range
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt)
      return isWithinInterval(orderDate, { start: from, end: to })
    })

    // Group by products
    const productMap = new Map<string, number>()

    filteredOrders.forEach((order) => {
      if (order.items && order.items.length > 0) {
        order.items.forEach((item) => {
          let productName = 'Unknown Product'

          if (typeof item.product === 'object' && item.product) {
            const product = item.product as Product
            productName = product.title || product.id?.toString() || 'Unknown Product'
          } else if (typeof item.product === 'string' || typeof item.product === 'number') {
            productName = `Product ${item.product}`
          }

          const currentValue = productMap.get(productName) || 0
          productMap.set(productName, currentValue + (item.quantity || 1))
        })
      }
    })

    // Convert to chart format and get top 10 products
    const data: ProductData[] = Array.from(productMap.entries())
      .map(([name, value], index) => ({
        name: name.length > 20 ? name.substring(0, 20) + '...' : name,
        value,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Show only top 10 products

    // If there are more than 10 products, group the rest as "Others"
    if (Array.from(productMap.entries()).length > 10) {
      const others = Array.from(productMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(10)
        .reduce((sum, [, value]) => sum + value, 0)

      if (others > 0) {
        data.push({
          name: 'Others',
          value: others,
          color: '#6b7280', // Gray
        })
      }
    }

    return data
  }, [orders, timePeriod, getDateRange])

  const totalItems = chartData.reduce((sum, item) => sum + item.value, 0)

  const renderCustomTooltip = (props: { active?: boolean; payload?: unknown }) => {
    const { active, payload } = props
    if (active && payload && Array.isArray(payload) && payload.length) {
      const data = (payload[0] as { payload: ProductData })?.payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            Sold: {data.value} ({((data.value / totalItems) * 100).toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
    cx: number
    cy: number
    midAngle: number
    innerRadius: number
    outerRadius: number
    percent: number
  }) => {
    if (percent < 0.05) return null // Don't show labels for slices < 5%

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Top Selling Products
          </CardTitle>
          <div className="flex items-center space-x-2">
            {timePeriod === 'custom' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'justify-start text-left font-normal',
                      !dateRange && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd')}
                        </>
                      ) : (
                        format(dateRange.from, 'MMM dd, y')
                      )
                    ) : (
                      <span>Pick dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            )}

            <Select
              value={timePeriod}
              onValueChange={(value) => setTimePeriod(value as TimePeriod)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="90d">90 days</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary */}
        <div className="text-center p-3 bg-amber-50 rounded-lg">
          <div className="text-2xl font-bold text-amber-600">{totalItems}</div>
          <div className="text-sm text-muted-foreground">Total Products Sold</div>
        </div>
      </CardHeader>

      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry: { color?: string }) => (
                    <span style={{ color: entry.color || '#000' }}>{value}</span>
                  )}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No product data available</p>
              <p className="text-sm">for the selected period</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
