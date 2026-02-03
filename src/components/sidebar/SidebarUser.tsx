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
                {/* <SidebarMenuItem>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
                                    <Avatar className="h-12 w-12 rounded-lg">
                                        <AvatarImage
                                            src={"/logo.jpg"}
                                            alt={"YR"}
                                        />
                                        <AvatarFallback className="rounded-lg">
                                            YR
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <>
                                        <span className="truncate font-semibold">
                                            {user?.name || "Admin"}
                                        </span>
                                        <span className="truncate text-xs">
                                            {user?.email || "admin@yeti.com"}
                                        </span>
                                    </>
                                </div>

                                <IconCaretUpDownFilled className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-16 w-16 rounded-lg">
                                        <AvatarImage
                                            src={"/logo.jpg"}
                                            alt={"YR"}
                                        />
                                        <AvatarFallback className="rounded-lg">
                                            YR
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">
                                            {" "}
                                            {user?.name}
                                        </span>
                                        <span className="truncate text-xs">
                                            {user?.email}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>

                         

                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setOpen(true)}>
                                <IconLogout />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem> */}
                <SidebarMenuItem>
                    <SidebarMenuButton
                        size="lg"
                        onClick={() => setOpen(true)}
                        className="data-[state=open]:bg-sidebar-accent  data-[state=open]:text-sidebar-accent-foreground "
                    >
                        <div className="flex items-center w-full px-3 py-2 rounded-md gap-2">
                            <IconLogout/>
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
