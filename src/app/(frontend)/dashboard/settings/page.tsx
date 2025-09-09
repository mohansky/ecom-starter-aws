// src/app/(frontend)/dashboard/settings/page.tsx
import { Heading } from '@/components/Heading'
import { requireAdmin } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { formatDate } from '@/lib/formatHelpers'

export default async function SettingsPage() {
  const user = await requireAdmin()

  return (
    <div className="space-y-6">
      <Heading size="md" className="mb-5">
        Account Details
      </Heading>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>User ID: {user.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {user.firstName && user.lastName && (
              <div>
                <Label>Name</Label>
                <div className="flex items-center gap-2">
                  <p className="mt-1 text-sm">
                    {user.firstName} {user.lastName}
                  </p>
                  <Badge
                    variant={user.role === 'admin' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>
            )}

            <div>
              <Label>Email</Label>
              <p className="mt-1 text-sm">{user.email}</p>
            </div>

            <div className="flex gap-8">
              <div>
                <Label>Created At</Label>
                <p className="mt-1 text-sm">{formatDate(user.createdAt)}</p>
              </div>

              <div>
                <Label>Updated At</Label>
                <p className="mt-1 text-sm">{formatDate(user.updatedAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
