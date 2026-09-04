"use client";

import { useEffect } from "react";
import { showErrorTost } from "@/lib/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import {
    IconArrowUpRight,
    IconBriefcase,
    IconCode,
    IconEdit,
    IconExternalLink,
    IconFolder,
    IconMail,
    IconMapPin,
    IconPhone,
    IconSchool,
    IconShare,
    IconShieldCheck,
    IconUser,
} from "@tabler/icons-react";
import { useQueryGetUser } from "@/hooks/query-hooks/useQueryGetUser";
import { useQueryGetProjects } from "@/hooks/query-hooks/useQueryGetProjects";
import { useQueryGetExperiences } from "@/hooks/query-hooks/useQueryGetExperiences";
import { useQueryGetSkills } from "@/hooks/query-hooks/useQueryGetSkills";
import { useQueryGetEducations } from "@/hooks/query-hooks/useQueryGetEducations";
import { useQueryGetSocials } from "@/hooks/query-hooks/useQueryGetSocials";
import { HtmlContent } from "../html-content";
import PageSkeleton from "../skeleton/PageSkeleton";

export default function UserPage({ error }: { error?: string }) {
    const { data: user, isLoading: isUserLoading } = useQueryGetUser();
    const { data: projects } = useQueryGetProjects();
    const { data: experiences } = useQueryGetExperiences();
    const { data: skills } = useQueryGetSkills();
    const { data: educations } = useQueryGetEducations();
    const { data: socials } = useQueryGetSocials();

    useEffect(() => {
        if (error) {
            showErrorTost(error);
            window.history.replaceState(
                null,
                "",
                `?${new URLSearchParams().toString()}`,
            );
        }
    }, [error]);

    if (isUserLoading || !user) {
        return <PageSkeleton />;
    }

    const name = user.name || "Nishank Gurung";
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const stats = [
        {
            label: "Projects",
            count: projects?.length ?? 0,
            href: "/admin/projects",
            icon: IconFolder,
            desc: "Featured apps & tools",
        },
        {
            label: "Experience",
            count: experiences?.length ?? 0,
            href: "/admin/experiences",
            icon: IconBriefcase,
            desc: "Career milestones",
        },
        {
            label: "Tech Skills",
            count: skills?.length ?? 0,
            href: "/admin/skills",
            icon: IconCode,
            desc: "Languages & stacks",
        },
        {
            label: "Education",
            count: educations?.length ?? 0,
            href: "/admin/education",
            icon: IconSchool,
            desc: "Degrees & institutes",
        },
        {
            label: "Social Links",
            count: socials?.length ?? 0,
            href: "/admin/socials",
            icon: IconShare,
            desc: "Public profiles",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border/60">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <IconUser className="size-6" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Admin Profile & Overview
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage your portfolio identity, personal bio, contact info, and portfolio statistics.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button variant="outline" size="sm" asChild className="text-xs">
                        <a href="/" target="_blank" rel="noopener noreferrer">
                            <IconExternalLink className="size-3.5 mr-1" />
                            Live Portfolio
                        </a>
                    </Button>
                    <Button size="sm" asChild className="text-xs font-semibold shadow-xs">
                        <Link href="/admin/editor/user">
                            <IconEdit className="size-3.5 mr-1" />
                            Edit Profile
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Profile Overview Card */}
            <Card className="shadow-xs border border-border/70 overflow-hidden relative">
                <div className="h-28 bg-gradient-to-r from-accent/20 via-primary/10 to-accent/5 relative">
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                        <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-xs font-medium gap-1">
                            <IconShieldCheck className="size-3.5" />
                            Verified Administrator
                        </Badge>
                    </div>
                </div>

                <CardContent className="px-6 pb-6 pt-0 relative">
                    {/* Avatar & Details Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-6">
                        <div className="flex items-end gap-4">
                            <div className="p-1 rounded-full bg-card shadow-lg ring-2 ring-border/80">
                                <Avatar className="size-24 rounded-full border-2 border-background">
                                    <AvatarImage src={user.image ?? undefined} alt={name} />
                                    <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="pb-1">
                                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                                    {name}
                                </h2>
                                {user.title && (
                                    <p className="text-sm font-medium text-accent">
                                        {user.title}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Button variant="outline" size="sm" asChild className="self-start sm:self-auto text-xs">
                            <Link href="/admin/editor/user">
                                <IconEdit className="size-3.5 mr-1" />
                                Edit Info
                            </Link>
                        </Button>
                    </div>

                    {/* Contact Pills Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/50 text-xs">
                        <div className="flex items-center gap-2">
                            <IconMail className="size-4 text-accent shrink-0" />
                            <div className="truncate">
                                <span className="block text-muted-foreground text-[10px] uppercase font-mono">Email</span>
                                <span className="font-medium text-foreground truncate">{user.email}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <IconPhone className="size-4 text-accent shrink-0" />
                            <div className="truncate">
                                <span className="block text-muted-foreground text-[10px] uppercase font-mono">Phone</span>
                                <span className="font-medium text-foreground">{user.phone ? `+977 ${user.phone}` : "Not set"}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <IconMapPin className="size-4 text-accent shrink-0" />
                            <div className="truncate">
                                <span className="block text-muted-foreground text-[10px] uppercase font-mono">Location</span>
                                <span className="font-medium text-foreground">{user.address || "Not set"}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Metrics Cards */}
            <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Portfolio Content Overview
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Link
                                key={stat.label}
                                href={stat.href}
                                className="group block"
                            >
                                <Card className="p-4 transition-all duration-200 hover:border-accent/40 hover:shadow-md hover:bg-card/80">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                                            <Icon className="size-4" />
                                        </div>
                                        <IconArrowUpRight className="size-4 text-muted-foreground/50 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                    </div>
                                    <span className="text-2xl font-bold tracking-tight text-foreground block">
                                        {stat.count}
                                    </span>
                                    <span className="text-xs font-semibold text-foreground/80 block mt-0.5">
                                        {stat.label}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground block truncate">
                                        {stat.desc}
                                    </span>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* About / Bio Preview Card */}
            {user.about && (
                <Card className="shadow-xs border border-border/70">
                    <CardHeader className="pb-3 border-b border-border/40">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">
                                    About & Biography
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Formatted content currently shown on your portfolio hero section.
                                </CardDescription>
                            </div>
                            <Button variant="ghost" size="xs" asChild>
                                <Link href="/admin/editor/user">
                                    Edit Text
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="font-mono text-sm leading-relaxed p-4 rounded-xl bg-muted/20 border border-border/50">
                            <HtmlContent html={user.about} />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
