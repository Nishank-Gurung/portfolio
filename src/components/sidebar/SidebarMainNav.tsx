'use client'

import {IconArrowRight} from '@tabler/icons-react'
import {usePathname} from 'next/navigation'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import {cn} from '@/lib/utils'
import Link from 'next/link'
import {SidebarNavLinks} from '@/config/constant'

export function SidebarMainNav({items}: {items: SidebarNavLinks[]}) {
  const pathname = usePathname()
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url
          return (
            <Collapsible
              defaultOpen={true}
              key={item.title}
              asChild
              className="group/collapsible"
            >
              {item.items && item.items.length > 0 ? (
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={cn('', isActive && 'bg-primary text-white')}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <IconArrowRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const isSubItemActive = pathname === subItem.url

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={subItem.url}
                                className={cn(
                                  'block w-full px-3 py-2 rounded-md',
                                  isSubItemActive &&
                                    'bg-primary text-white group/icon'
                                )}
                              >
                                {subItem.icon && (
                                  <subItem.icon
                                    className={cn(
                                      isSubItemActive &&
                                        'stroke-white group-hover/icon:stroke-black dark:group-hover/icon:stroke-white'
                                    )}
                                  />
                                )}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              ) : (
                // For main items with no children
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link
                      href={item.url}
                      className={cn(
                        'flex items-center w-full px-3 py-2 rounded-md',
                        isActive && 'bg-gray-600 text-white'
                      )}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
