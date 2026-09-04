"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
    IconArrowDown,
    IconArrowRight,
    IconCheck,
    IconCode,
    IconCopy,
    IconFileText,
    IconMail,
    IconMapPin,
    IconPhone,
    IconSparkles,
} from "@tabler/icons-react";
import { useQueryGetUser } from "@/hooks/query-hooks/useQueryGetUser";
import { SocialsSection } from "./socials";
import { HtmlContent } from "../html-content";
import { Skeleton } from "../ui/skeleton";
import { User } from "@/generated/prisma/client";
import { toast } from "sonner";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            damping: 25,
            stiffness: 260,
        },
    },
};

const floatLeftVariants = {
    animate: {
        y: [0, -8, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" as const,
        },
    },
};

const floatRightVariants = {
    animate: {
        y: [0, 8, 0],
        transition: {
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut" as const,
        },
    },
};

export function HeroSection() {
    const { data: userData, isLoading } = useQueryGetUser();
    const [copiedEmail, setCopiedEmail] = useState(false);

    const handleCopyEmail = async (email: string) => {
        try {
            await navigator.clipboard.writeText(email);
            setCopiedEmail(true);
            toast.success("Email copied to clipboard!");
            setTimeout(() => setCopiedEmail(false), 2000);
        } catch (err) {
            console.error("Failed to copy email:", err);
            toast.error("Failed to copy email");
        }
    };

    if (isLoading || !userData) {
        return (
            <section className="relative flex min-h-dvh items-center justify-center px-6 py-20 overflow-hidden">
                <div className="mx-auto flex max-w-5xl flex-col items-center text-center w-full space-y-8">
                    {/* Status Pill Skeleton */}
                    <Skeleton className="h-8 w-64 rounded-full" />

                    {/* Avatar Skeleton */}
                    <div className="relative">
                        <Skeleton className="size-32 sm:size-36 rounded-full" />
                    </div>

                    {/* Title Skeleton */}
                    <div className="space-y-3 flex flex-col items-center w-full">
                        <Skeleton className="h-4 w-36 rounded-md" />
                        <Skeleton className="h-12 sm:h-16 w-3/4 max-w-lg rounded-lg" />
                    </div>

                    {/* Content Box Skeleton */}
                    <div className="w-full max-w-4xl rounded-2xl border border-border/50 p-6 sm:p-8 space-y-4">
                        <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                            <div className="space-y-3 text-left">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-[90%]" />
                                <Skeleton className="h-4 w-[85%]" />
                                <Skeleton className="h-4 w-[60%]" />
                            </div>
                            <div className="space-y-3 w-48 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-6">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                        </div>
                    </div>

                    {/* CTA Buttons Skeleton */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Skeleton className="h-11 w-36 rounded-lg" />
                        <Skeleton className="h-11 w-36 rounded-lg" />
                    </div>

                    {/* Socials Skeleton */}
                    <div className="flex items-center gap-4">
                        <Skeleton className="size-9 rounded-md" />
                        <Skeleton className="size-9 rounded-md" />
                        <Skeleton className="size-9 rounded-md" />
                    </div>
                </div>
            </section>
        );
    }

    const user: User = userData;

    return (
        <section
            id="hero"
            className="relative flex min-h-dvh items-center justify-center px-4 sm:px-6 py-24 sm:py-28 overflow-hidden"
        >
            {/* Ambient Background Glows & Mesh Pattern */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                {/* Center Radial Glow in accent color */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[650px] sm:w-[850px] rounded-full bg-accent/15 blur-[130px] dark:bg-accent/10" />
                {/* Secondary Soft Glow */}
                <div className="absolute top-1/3 left-1/4 -translate-y-1/2 h-[300px] w-[400px] rounded-full bg-primary/10 blur-[110px]" />
                
                {/* Subtle Geometric Dot Grid with Radial Fade */}
                <div
                    className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06] [mask-image:radial-gradient(ellipse_65%_50%_at_50%_35%,#000_70%,transparent_100%)]"
                    style={{
                        backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                        backgroundSize: "32px 32px",
                    }}
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex max-w-5xl flex-col items-center text-center w-full"
            >
                {/* Top Status Badge */}
                <motion.div variants={itemVariants} className="mb-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/70 bg-card/60 backdrop-blur-md text-xs font-medium text-muted-foreground shadow-xs hover:border-accent/40 transition-colors">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span>Available for new opportunities</span>
                    </div>
                </motion.div>

                {/* Avatar with Floating Badges */}
                <motion.div variants={itemVariants} className="relative mb-6">
                    {/* Floating Left Specialty Badge */}
                    <motion.div
                        variants={floatLeftVariants}
                        animate="animate"
                        className="hidden sm:flex absolute -left-36 top-1/2 -translate-y-1/2 items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80 bg-card/80 backdrop-blur-md shadow-md text-xs font-medium text-foreground hover:border-accent/40 transition-colors"
                    >
                        <div className="p-1 rounded-md bg-accent/15 text-accent">
                            <IconCode className="size-3.5" />
                        </div>
                        <span>Full-Stack Engineer</span>
                    </motion.div>

                    {/* Central Glowing Avatar */}
                    <div className="relative p-1 rounded-full bg-gradient-to-tr from-accent via-accent/40 to-transparent shadow-xl">
                        <Avatar className="size-28 sm:size-32 ring-4 ring-background shadow-2xl">
                            <AvatarImage src={user?.image ?? undefined} alt={user.name} />
                            <AvatarFallback className="text-2xl font-bold bg-secondary text-secondary-foreground">
                                {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>

                        {/* Verified / Active Indicator Dot */}
                        <div className="absolute bottom-1 right-1 size-5 rounded-full bg-background p-0.5 shadow-sm">
                            <div className="size-full rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white">
                                <IconSparkles className="size-2.5" />
                            </div>
                        </div>
                    </div>

                    {/* Floating Right Location Badge */}
                    {user.address && (
                        <motion.div
                            variants={floatRightVariants}
                            animate="animate"
                            className="hidden sm:flex absolute -right-36 top-1/2 -translate-y-1/2 items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80 bg-card/80 backdrop-blur-md shadow-md text-xs font-medium text-foreground hover:border-accent/40 transition-colors"
                        >
                            <div className="p-1 rounded-md bg-accent/15 text-accent">
                                <IconMapPin className="size-3.5" />
                            </div>
                            <span>{user.address}</span>
                        </motion.div>
                    )}
                </motion.div>

                {/* Role Subtitle */}
                {user.title && (
                    <motion.div variants={itemVariants} className="mb-2">
                        <Badge
                            variant="secondary"
                            className="text-xs sm:text-sm font-medium tracking-wide uppercase px-3 py-0.5 text-accent border border-accent/20 bg-accent/10"
                        >
                            {user.title}
                        </Badge>
                    </motion.div>
                )}

                {/* Main Headline */}
                <motion.h1
                    variants={itemVariants}
                    className="mb-8 text-4xl font-bold tracking-tight text-foreground text-balance sm:text-6xl lg:text-7xl"
                >
                    {"Hi, I'm "}
                    <span className="text-gradient hover:brightness-110 transition-all font-extrabold">
                        {user.name}
                    </span>
                </motion.h1>

                {/* Glassmorphic Bio & Quick Details Card */}
                <motion.div
                    variants={itemVariants}
                    className="w-full max-w-4xl rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl p-6 sm:p-8 shadow-sm mb-10 transition-all hover:border-accent/30"
                >
                    <div className="grid w-full gap-8 md:grid-cols-[1fr_auto] text-left items-start">
                        {/* Bio Text Column */}
                        <div>
                            {user.about ? (
                                <HtmlContent
                                    html={user.about}
                                    className="font-mono text-[16px] sm:text-[17px] leading-relaxed text-foreground/90"
                                />
                            ) : null}
                        </div>

                        {/* Quick Contact & Info Sidebar */}
                        <div className="flex flex-col justify-center space-y-3.5 border-t md:border-t-0 md:border-l border-border/60 pt-6 md:pt-0 md:pl-8 text-left min-w-[240px]">
                            <div className="flex items-center justify-between pb-1 border-b border-border/40">
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    Quick Details
                                </h3>
                                <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                                    Verified
                                </Badge>
                            </div>

                            <div className="space-y-2.5">
                                {user.address && (
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <div className="p-1 rounded-md bg-accent/10 text-accent shrink-0">
                                            <IconMapPin className="size-3.5" />
                                        </div>
                                        <span className="text-foreground/90 font-medium">
                                            {user.address}
                                        </span>
                                    </div>
                                )}

                                {user.email && (
                                    <div className="flex items-center justify-between gap-2 text-sm">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="p-1 rounded-md bg-accent/10 text-accent shrink-0">
                                                <IconMail className="size-3.5" />
                                            </div>
                                            <a
                                                href={`mailto:${user.email}`}
                                                className="hover:text-accent transition-colors font-medium truncate"
                                                title={user.email}
                                            >
                                                {user.email}
                                            </a>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon-xs"
                                            onClick={() => handleCopyEmail(user.email)}
                                            className="text-muted-foreground hover:text-foreground shrink-0"
                                            title="Copy email to clipboard"
                                        >
                                            {copiedEmail ? (
                                                <IconCheck className="size-3.5 text-emerald-500" />
                                            ) : (
                                                <IconCopy className="size-3.5" />
                                            )}
                                        </Button>
                                    </div>
                                )}

                                {user.phone && (
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <div className="p-1 rounded-md bg-accent/10 text-accent shrink-0">
                                            <IconPhone className="size-3.5" />
                                        </div>
                                        <a
                                            href={`tel:+977${user.phone.replace(/\s+/g, "")}`}
                                            className="hover:text-accent transition-colors font-medium"
                                        >
                                            +977 {user.phone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Action Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="mb-10 flex flex-wrap items-center justify-center gap-4"
                >
                    <Button
                        size="lg"
                        className="group relative shadow-md shadow-accent/15 hover:shadow-accent/25 transition-all text-sm font-semibold"
                        asChild
                    >
                        <a href="#contact">
                            <IconMail className="mr-2 size-4 group-hover:scale-110 transition-transform" />
                            Get in touch
                            <IconArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        className="border-border/80 hover:bg-accent/10 hover:border-accent/40 transition-all text-sm font-semibold shadow-xs"
                        asChild
                    >
                        <a href="#projects">
                            <IconFileText className="mr-2 size-4" />
                            View Projects
                        </a>
                    </Button>
                </motion.div>

                {/* Social Media Links */}
                <motion.div variants={itemVariants}>
                    <TooltipProvider delayDuration={0}>
                        <div className="flex items-center gap-4 p-2 rounded-xl border border-border/50 bg-card/40 backdrop-blur-md">
                            <SocialsSection />
                        </div>
                    </TooltipProvider>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.a
                href="#experience"
                animate={{ y: [0, 8, 0] }}
                transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                }}
                className="absolute bottom-6 flex flex-col items-center gap-1 text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                aria-label="Scroll to experience"
            >
                <span className="text-[10px] font-mono tracking-widest uppercase opacity-70">
                    Scroll
                </span>
                <IconArrowDown className="size-4" />
            </motion.a>
        </section>
    );
}
