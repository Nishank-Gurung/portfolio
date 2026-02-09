"use client";

import { IconCaretUpDownFilled, IconLogout } from "@tabler/icons-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import React from "react";

import LogOutModal from "../global/LogoutModal";

export function SidebarUser() {
    const { isMobile } = useSidebar();
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        size="lg"
                        onClick={() => setOpen(true)}
                        className="data-[state=open]:bg-sidebar-accent  data-[state=open]:text-sidebar-accent-foreground "
                    >
                        <div className="flex items-center w-full px-3 py-2 rounded-md gap-2">
                            <IconLogout />
                            <span>Logout</span>
                        </div>
                    </SidebarMenuButton>
                    <LogOutModal
                        isOpen={open}
                        closeModal={() => setOpen(false)}
                    />
                </SidebarMenuItem>
            </SidebarMenu>
        </>
    );
}
