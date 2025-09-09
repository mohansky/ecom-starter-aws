// src/app/(frontend)/dashboard/analytics/page.tsx
import { Heading } from '@/components/Heading'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <Heading size="md" className="mb-5">
        Analytics
      </Heading>
      <div className="border-1 border-border rounded-lg p-6">
        <p className="text-muted-foreground">
          Advanced analytics and reporting features will be available here.
        </p>
      </div>
    </div>
  )
}
