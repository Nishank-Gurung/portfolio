"use client";

import React, { useState } from "react";
import { IconLogout } from "@tabler/icons-react";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQueryGetUser } from "@/hooks/query-hooks/useQueryGetUser";
import LogOutModal from "../global/LogoutModal";

export function SidebarUser() {
    const [open, setOpen] = useState(false);
    const { data: user } = useQueryGetUser();

    const name = user?.name || "Admin User";
    const email = user?.email || "admin@portfolio.dev";
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-sidebar-accent/40 border border-sidebar-border/60 gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <Avatar className="size-8 rounded-lg ring-1 ring-border shrink-0">
                                <AvatarImage src={user?.image ?? undefined} alt={name} />
                                <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>

                            <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
                                <span className="truncate font-semibold text-foreground">
                                    {name}
                                </span>
                                <span className="truncate text-[10px] font-mono text-muted-foreground">
                                    {email}
                                </span>
                            </div>
                        </div>

                        <SidebarMenuButton
                            size="sm"
                            onClick={() => setOpen(true)}
                            className="size-8 p-0 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center justify-center"
                            title="Sign out of Admin CMS"
                        >
                            <IconLogout className="size-4" />
                        </SidebarMenuButton>
                    </div>

                    <LogOutModal
                        isOpen={open}
                        closeModal={() => setOpen(false)}
                    />
                </SidebarMenuItem>
            </SidebarMenu>
        </>
    );
}
