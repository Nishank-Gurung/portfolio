"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    IconExternalLink,
    IconChevronRight,
    IconHome,
} from "@tabler/icons-react";

const ROUTE_LABELS: Record<string, string> = {
    admin: "Admin",
    user: "User Profile",
    projects: "Projects",
    experiences: "Experiences",
    education: "Education",
    skills: "Skills",
    socials: "Social Links",
    blog: "Blog",
    gitpage: "Git Timestamp Generator",
    editor: "Editor",
    project: "Project Editor",
    experience: "Experience Editor",
    skill: "Skill Editor",
    social: "Social Link Editor",
};

export default function AdminHeader() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 border-b border-border/50 bg-card/30 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
            <div className="flex items-center gap-2 min-w-0">
                <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
                <Separator orientation="vertical" className="mr-2 h-4" />

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-1.5 text-xs text-muted-foreground truncate" aria-label="Breadcrumb">
                    <Link
                        href="/admin/user"
                        className="flex items-center gap-1 hover:text-foreground transition-colors font-medium"
                    >
                        <IconHome className="size-3.5" />
                        <span>CMS</span>
                    </Link>

                    {segments.slice(1).map((seg, idx) => {
                        const isLast = idx === segments.length - 2;
                        const label = ROUTE_LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
                        const href = "/" + segments.slice(0, idx + 2).join("/");

                        return (
                            <div key={href} className="flex items-center gap-1.5 truncate">
                                <IconChevronRight className="size-3 text-muted-foreground/60 shrink-0" />
                                {isLast ? (
                                    <span className="font-semibold text-foreground truncate">
                                        {label}
                                    </span>
                                ) : (
                                    <Link
                                        href={href}
                                        className="hover:text-foreground transition-colors truncate"
                                    >
                                        {label}
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
                {/* Live Status Badge */}
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-500">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live CMS</span>
                </div>

                {/* View Live Portfolio Shortcut */}
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-medium gap-1.5 border-border/80 hover:bg-accent/10 hover:border-accent/40 hover:text-accent shadow-xs"
                    asChild
                >
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open public portfolio website in a new tab"
                    >
                        <span className="hidden sm:inline">View Live Site</span>
                        <IconExternalLink className="size-3.5" />
                    </a>
                </Button>
            </div>
        </header>
    );
}
