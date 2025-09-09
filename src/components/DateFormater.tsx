// src/components/DateFormater.tsx
import { parseISO, format } from 'date-fns'

interface DateFormatterProps {
  dateString?: string | Date | null
}

export default function DateFormatter({ dateString }: DateFormatterProps) {
  if (!dateString) {
    return <span className="text-muted-foreground">-</span>
  }

  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString
  const isoString = typeof dateString === 'string' ? dateString : dateString.toISOString()

  return <time dateTime={isoString}>{format(date, 'd LLL yyyy')}</time>
}
