"use client";

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { IconTerminal2 } from "@tabler/icons-react";
import Link from "next/link";

export function SidebarTop() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    asChild
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors"
                >
                    <Link href="/admin/user" className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-tr from-accent to-accent/60 text-accent-foreground shadow-sm shadow-accent/20">
                            <IconTerminal2 className="size-5" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-bold tracking-tight text-foreground">
                                Portfolio CMS
                            </span>
                            <span className="truncate text-[11px] font-mono text-muted-foreground">
                                Admin Dashboard
                            </span>
                        </div>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
