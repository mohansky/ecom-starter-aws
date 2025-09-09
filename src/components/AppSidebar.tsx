'use client'
// src/components/AppSidebar.tsx
import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Home,
  BarChart3,
  Settings,
  User2,
  ChevronUp,
  Package,
  FolderOpen,
  UserRoundCog,
  LogOut,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { User } from '@/payload-types'
import { Button } from './ui/button'

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    url: '/dashboard/products',
    icon: Package,
  },
  {
    title: 'Categories',
    url: '/dashboard/categories',
    icon: FolderOpen,
  },
  {
    title: 'Orders',
    url: '/dashboard/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Customers',
    url: '/dashboard/customers',
    icon: Users,
  },
]

const otherItems = [
  {
    title: 'Analytics',
    url: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'Account Details',
    url: '/dashboard/settings',
    icon: UserRoundCog,
  },
  {
    title: 'Back to Site',
    url: '/',
    icon: Home,
  },
  {
    title: 'Back to Admin',
    url: '/admin',
    icon: Settings,
  },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: User
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const displayName =
    user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || 'User'

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        router.push('/admin')
        router.refresh()
      }
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="lg:h-[calc(100vh-200px)] lg:max-h-[calc(100vh-200px)] lg:overflow-hidden lg:sticky lg:top-0"
      {...props}
    >
      <SidebarContent className="lg:h-full lg:overflow-y-auto lg:py-2">
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Other</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {displayName}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem onClick={handleSignOut} className="p-0">
                  <Button variant="destructive" className="w-full">
                    Sign out
                    <LogOut className="ml-2 h-4 w-4 text-destructive-foreground" />
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
