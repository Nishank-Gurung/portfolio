"use client";

import { IconArrowRight } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { SidebarNavLinks } from "@/config/constant";

export function SidebarMainNav({ items }: { items: SidebarNavLinks[] }) {
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarMenu className="gap-1">
                {items.map((item) => {
                    const isActive = pathname === item.url || (item.url !== "/admin/user" && pathname.startsWith(item.url));

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
                                            className={cn(
                                                "transition-colors text-sm font-medium",
                                                isActive && "bg-accent/15 text-accent font-semibold"
                                            )}
                                        >
                                            {item.icon && <item.icon className="size-4 shrink-0" />}
                                            <span>{item.title}</span>
                                            <IconArrowRight className="ml-auto size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-muted-foreground" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items.map((subItem) => {
                                                const isSubItemActive = pathname === subItem.url;

                                                return (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton asChild>
                                                            <Link
                                                                href={subItem.url}
                                                                className={cn(
                                                                    "block w-full px-3 py-1.5 rounded-md text-xs transition-colors",
                                                                    isSubItemActive
                                                                        ? "bg-accent/15 text-accent font-semibold"
                                                                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                                                                )}
                                                            >
                                                                {subItem.icon && (
                                                                    <subItem.icon className="size-3.5 inline mr-1.5" />
                                                                )}
                                                                <span>{subItem.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                );
                                            })}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            ) : (
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        isActive={isActive}
                                        className={cn(
                                            "flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                                            isActive
                                                ? "bg-accent/15 text-accent font-semibold shadow-xs"
                                                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                                        )}
                                    >
                                        <Link href={item.url}>
                                            {item.icon && (
                                                <item.icon
                                                    className={cn(
                                                        "size-4 shrink-0 transition-colors",
                                                        isActive ? "text-accent" : "text-muted-foreground"
                                                    )}
                                                />
                                            )}
                                            <span className="truncate">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
