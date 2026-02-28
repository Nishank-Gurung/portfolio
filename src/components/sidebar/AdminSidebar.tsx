"use client";
import { AdminSideBarLinks } from "@/config/constant";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "../ui/sidebar";
import { SidebarTop } from "./SidebarTop";
import { SidebarMainNav } from "./SidebarMainNav";
import { SidebarUser } from "./SidebarUser";

const AdminSidebar = () => {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarTop />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMainNav items={AdminSideBarLinks} />
            </SidebarContent>
            <SidebarFooter>
                <SidebarUser />
            </SidebarFooter>
        </Sidebar>
    );
};
export default AdminSidebar;
