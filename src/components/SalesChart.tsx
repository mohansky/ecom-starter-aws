'use client'
// src/components/SalesChart.tsx
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
import { CalendarIcon, TrendingUp } from 'lucide-react'
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns'
import { cn } from '@/lib/utils'
import { DateRange } from 'react-day-picker'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Order } from '@/payload-types'

interface SalesChartProps {
  orders: Order[]
}

type TimePeriod = '7d' | '30d' | '90d' | 'custom'

export function SalesChart({ orders }: SalesChartProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('7d')
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
          from: dateRange?.from ? startOfDay(dateRange.from) : startOfDay(subDays(now, 6)),
          to: dateRange?.to ? endOfDay(dateRange.to) : to,
        }
      default:
        return { from: startOfDay(subDays(now, 6)), to }
    }
  }, [dateRange])

  const chartData = useMemo(() => {
    const { from, to } = getDateRange(timePeriod)

    // Filter orders within the date range
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt)
      return isWithinInterval(orderDate, { start: from, end: to })
    })

    // Group orders by date
    const groupedData: { [key: string]: { sales: number; orders: number } } = {}

    // Initialize all dates in range with zero values
    const currentDate = new Date(from)
    while (currentDate <= to) {
      const dateKey = format(currentDate, 'yyyy-MM-dd')
      groupedData[dateKey] = { sales: 0, orders: 0 }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Aggregate sales data
    filteredOrders.forEach((order) => {
      const dateKey = format(new Date(order.createdAt), 'yyyy-MM-dd')
      if (groupedData[dateKey]) {
        groupedData[dateKey].sales += order.total || 0
        groupedData[dateKey].orders += 1
      }
    })

    // Convert to chart format
    return Object.entries(groupedData)
      .map(([date, data]) => ({
        date,
        sales: data.sales,
        orders: data.orders,
        displayDate: format(new Date(date), 'MMM dd'),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [orders, timePeriod, getDateRange])

  const totalSales = chartData.reduce((sum, item) => sum + item.sales, 0)
  const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0)
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

  // Calculate growth from previous period
  const midPoint = Math.floor(chartData.length / 2)
  const firstHalf = chartData.slice(0, midPoint)
  const secondHalf = chartData.slice(midPoint)

  const firstHalfTotal = firstHalf.reduce((sum, item) => sum + item.sales, 0)
  const secondHalfTotal = secondHalf.reduce((sum, item) => sum + item.sales, 0)

  const growthPercentage =
    firstHalfTotal > 0 ? ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100 : 0

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'sales') {
      return [`₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 'Sales']
    }
    return [value, 'Orders']
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Sales Overview
          </CardTitle>
          <div className="flex items-center space-x-2">
            {timePeriod === 'custom' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal',
                      !dateRange && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'LLL dd, y')} -{' '}
                          {format(dateRange.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(dateRange.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date range</span>
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
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              ₹{totalSales.toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-muted-foreground">Total Sales</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{totalOrders}</div>
            <div className="text-sm text-muted-foreground">Total Orders</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              ₹{avgOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-sm text-muted-foreground">Avg Order Value</div>
          </div>
        </div>

        {/* Growth Indicator */}
        {growthPercentage !== 0 && (
          <div className="flex items-center mt-2">
            <TrendingUp
              className={cn(
                'mr-1 h-4 w-4',
                growthPercentage > 0 ? 'text-green-600' : 'text-red-600',
              )}
            />
            <span
              className={cn(
                'text-sm font-medium',
                growthPercentage > 0 ? 'text-green-600' : 'text-red-600',
              )}
            >
              {growthPercentage > 0 ? '+' : ''}
              {growthPercentage.toFixed(1)}% from previous period
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="displayDate" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tickFormatter={(value) =>
                  `₹${value.toLocaleString('en-IN', { notation: 'compact' })}`
                }
              />
              <Tooltip
                formatter={formatTooltipValue}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
