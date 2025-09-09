'use client'
// app/components/custom-ui/custom-data-table.tsx
import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DateRange } from 'react-day-picker'
import { isWithinInterval, parseISO, endOfDay, startOfDay, isValid } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Heading } from '@/components/Heading'

interface FilterConfig {
  column: string
  placeholder: string
}

// Add this new type helper
// type KeysOfType<T, V> = {
//   [K in keyof T]: T[K] extends V ? K : never;
// }[keyof T];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  tableTitle?: string
  tableSubtitle?: string
  pgSize?: number
  filters?: FilterConfig[]
  showDatePicker?: boolean
  dateField?: keyof TData
  initialColumnVisibility?: VisibilityState
}

type DateInput = Date | string | number

const parseDateSafely = (dateValue: DateInput | null | undefined): Date | null => {
  if (!dateValue) return null

  if (dateValue instanceof Date) {
    return isValid(dateValue) ? dateValue : null
  }

  if (typeof dateValue === 'string') {
    try {
      const parsedDate = parseISO(dateValue)
      return isValid(parsedDate) ? parsedDate : null
    } catch {
      return null
    }
  }

  if (typeof dateValue === 'number') {
    const date = new Date(dateValue)
    return isValid(date) ? date : null
  }

  return null
}

export function CustomDataTable<TData, TValue>({
  columns,
  data,
  tableTitle,
  tableSubtitle,
  pgSize,
  filters = [],
  showDatePicker,
  dateField = 'date' as keyof TData,
  initialColumnVisibility = {},
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility)
  const [rowSelection, setRowSelection] = React.useState({})
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [filteredData, setFilteredData] = React.useState(data)

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: pgSize || 10,
  })

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  )

  React.useEffect(() => {
    if (!dateRange?.from || !dateRange?.to) {
      setFilteredData(data)
      return
    }

    const filtered = data.filter((item: TData) => {
      const itemDate = parseDateSafely(item[dateField] as DateInput)
      if (!itemDate) return false

      return isWithinInterval(itemDate, {
        start: startOfDay(dateRange.from || ' '),
        end: endOfDay(dateRange.to || ' '),
      })
    })

    setFilteredData(filtered)
  }, [dateRange, data, dateField])

  const handleDateRangeSelect = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const [filterCounts, setFilterCounts] = React.useState<Record<string, number>>({})

  React.useEffect(() => {
    const counts: Record<string, number> = {}

    // Count for each column filter
    columnFilters.forEach((filter) => {
      if (filter.value && String(filter.value).trim() !== '') {
        const filteredCount = data.filter((item) => {
          const itemValue = item[filter.id as keyof TData]
          if (itemValue === null || itemValue === undefined) {
            return false
          }
          return String(itemValue).toLowerCase().includes(String(filter.value).toLowerCase())
        }).length

        counts[filter.id] = filteredCount
      }
    })

    // Count for date range filter
    if (dateRange?.from && dateRange?.to) {
      const dateFilteredCount = data.filter((item: TData) => {
        const itemDate = parseDateSafely(item[dateField] as DateInput)
        if (!itemDate) return false
        return isWithinInterval(itemDate, {
          start: startOfDay(dateRange.from || new Date()),
          end: endOfDay(dateRange.to || new Date()),
        })
      }).length
      counts['dateRange'] = dateFilteredCount
    }

    setFilterCounts(counts)
  }, [columnFilters, dateRange, data, dateField])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  return (
    <div className="overflow-x-auto sm:overflow-visible">
      <div>
        <Heading size="sm" className="mb-2">
          {tableTitle}
        </Heading>
        <Heading size="xs" fontweight="normal" className="mb-5">
          {tableSubtitle}
        </Heading>
      </div>

      {showDatePicker && (
        <div className="flex items-center gap-4 my-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  'w-[250px] justify-start text-left font-normal',
                  !dateRange && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
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
                autoFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeSelect}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button
            onClick={() => {
              setDateRange(undefined)
              setFilteredData(data)
            }}
            className="px-2 h-8"
          >
            Reset Dates
          </Button>
        </div>
      )}

      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 my-2">
          {filters.map((filter) => (
            <div key={filter.column} className="flex flex-col gap-1">
              <Input
                placeholder={filter.placeholder}
                value={(table.getColumn(filter.column)?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                  table.getColumn(filter.column)?.setFilterValue(event.target.value)
                }
                className="max-w-xs"
              />
              {filterCounts[filter.column] !== undefined && (
                <div className="text-sm text-muted-foreground pl-2">
                  {filterCounts[filter.column]} matches
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="p-1 bg-muted rounded-lg">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        index === 1 && 'sticky left-0 z-20 bg-muted shadow-sm max-w-fit',
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                    // <TableHead key={header.id} >
                    //   {header.isPlaceholder
                    //     ? null
                    //     : flexRender(
                    //         header.column.columnDef.header,
                    //         header.getContext()
                    //       )}
                    // </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="even:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={cn(index === 1 && 'sticky left-0 z-10 max-w-fit bg-muted')}
                      >
                        {/* <TableCell key={cell.id}> */}
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              {table.getFooterGroups().map((footerGroup) => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <TableCell key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.footer, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredData.length} of {data.length} records
        </div>
        <div className="flex items-center space-x-6">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomDataTable
