'use client'
// src/components/SidebarTrigger.tsx
import * as React from 'react'
import { PanelRightOpen, PanelRightClose } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

export function SidebarTrigger({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, state } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        className,
      )}
      onClick={toggleSidebar}
      {...props}
    >
      {state === 'expanded' ? (
        <PanelRightClose className="h-4 w-4" />
      ) : (
        <PanelRightOpen className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}
