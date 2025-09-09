// src/app/(frontend)/dashboard/layout.tsx
import { requireAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/AppSidebar'
import { SidebarTrigger } from '@/components/SidebarTrigger'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let user
  try {
    user = await requireAdmin()
  } catch (_error) {
    redirect('/admin')
  }

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AppSidebar user={user} />
        <SidebarInset className="flex flex-1 flex-col lg:min-h-[calc(100vh-200px)]">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.email || 'Admin'}
              </h1>
              {user.email && <span className="text-sm text-muted-foreground">({user.email})</span>}
            </div>
          </header>
          <main className="flex-1 space-y-4 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
