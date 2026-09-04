import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import SidebarPageTransition from "@/components/global/SidebarPageTransition";
import SidebarContainer from "@/components/global/SidebarContainer";
import AdminHeader from "@/components/admin/AdminHeader";

const AdminSidebarLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <AdminHeader />
                <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 max-w-8xl w-full mx-auto">
                    <SidebarPageTransition>
                        <SidebarContainer>{children}</SidebarContainer>
                    </SidebarPageTransition>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default AdminSidebarLayout;
