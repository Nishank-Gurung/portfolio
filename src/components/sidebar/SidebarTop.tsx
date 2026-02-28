'use client'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function SidebarTop() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent  data-[state=open]:text-sidebar-accent-foreground "
        >
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold relative ">
              Portfolio - Admin Panel
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
