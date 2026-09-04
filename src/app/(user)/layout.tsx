import { Metadata } from "next";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";

export const metadata: Metadata = {
    title: {
        template: "Nishank Gurung | %s",
        default: "Nishank Gurung",
    },
};

const UserLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative min-h-screen flex flex-col bg-background text-foreground selection:bg-accent/20 selection:text-accent">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
};

export default UserLayout;
