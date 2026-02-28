"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
    IconArrowDown,
    IconFileText,
    IconMail,
    IconMapPin,
    IconPhone,
} from "@tabler/icons-react";
import { useQueryGetUser } from "@/hooks/query-hooks/useQueryGetUser";
import { useQueryGetSocials } from "@/hooks/query-hooks/useQueryGetSocials";
import { SocialIcon } from "./SocialIcon";
import { socialMedia, user } from "@/lib/types";
import { extractParagraphsOnly } from "@/lib/utils";
import { SocialsSection } from "./socials";
import { HtmlContent } from "../html-content";
import { Skeleton } from "../ui/skeleton";

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim();
}

export function HeroSection() {
    const { data: userData, isLoading } = useQueryGetUser();

    if (isLoading || !userData?.data?.user) {
        return (
            <section className="relative flex min-h-dvh items-center justify-center px-6 py-20">
                <div className="mx-auto flex max-w-4xl flex-col items-center text-center w-full">
                    {/* Avatar Skeleton */}
                    <Skeleton className="mb-8 size-28 rounded-full ring-2 ring-border ring-offset-4 ring-offset-background" />
                    {/* Title/Subtitle Skeletons */}
                    <Skeleton className="mb-3 h-4 w-32" /> {/* user.title */}
                    <Skeleton className="mb-8 h-12 w-3/4 sm:h-16 lg:h-20" />{" "}
                    {/* Hi, I'm... */}
                    {/* About & Details Grid */}
                    <div className="grid w-full gap-10 md:grid-cols-[1fr_auto] md:text-left mb-10">
                        {/* Main About Text */}
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[90%]" />
                            <Skeleton className="h-4 w-[95%]" />
                            <Skeleton className="h-4 w-[40%]" />
                        </div>

                        {/* Sidebar Details */}
                        <div className="flex flex-col justify-center space-y-4 border-l border-border/50 pl-8 text-left md:flex">
                            <Skeleton className="h-3 w-16 mb-2" />{" "}
                            {/* "Details" label */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="size-4 rounded-sm" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Skeleton className="size-4 rounded-sm" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Skeleton className="size-4 rounded-sm" />
                                    <Skeleton className="h-4 w-28" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* CTA Buttons */}
                    <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
                        <Skeleton className="h-11 w-36 rounded-md" />{" "}
                        {/* Primary Button */}
                        <Skeleton className="h-11 w-36 rounded-md" />{" "}
                        {/* Outline Button */}
                    </div>
                    {/* Social Icons */}
                    <div className="flex items-center gap-5">
                        <Skeleton className="size-6 rounded-full" />
                        <Skeleton className="size-6 rounded-full" />
                        <Skeleton className="size-6 rounded-full" />
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10">
                    <Skeleton className="size-6 rounded-full" />
                </div>
            </section>
        );
    }
    const user: user = userData?.data.user;

    return (
        <section
            id="hero"
            className="relative flex min-h-dvh items-center justify-center px-6 py-20"
        >
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                {/* Avatar Section */}
                <Avatar className="mb-8 size-28 ring-2 ring-border ring-offset-4 ring-offset-background">
                    <AvatarImage src={user?.image} alt={user.name} />
                    <AvatarFallback className="text-2xl font-semibold bg-secondary text-secondary-foreground">
                        {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </AvatarFallback>
                </Avatar>

                {/* Title */}
                <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
                    {user.title}
                </p>

                <h1 className="mb-8 text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl lg:text-7xl">
                    {"Hi, I'm "}
                    <span className="text-gradient">{user.name}</span>
                </h1>

                {/* About & Details Grid */}
                <div className="grid w-full gap-10 md:grid-cols-[1fr_auto] text-left mb-10">
                    <div>
                        {user.about ? (
                            <HtmlContent
                                html={user.about}
                                // className="text-lg prose-p:my-1 prose-ul:my-2 prose-li:my-0 text-pretty"
                                className="font-mono text-[18px] leading-relaxed"
                            />
                        ) : null}
                    </div>

                    {/* Compact Details Sidebar */}
                    <div className="flex flex-col justify-center space-y-4 border-l border-border/50 pl-8 text-left md:flex ">
                        <h3 className="text-base font-medium uppercase tracking-widest text-muted-foreground">
                            Details
                        </h3>
                        <div className="space-y-3">
                            {user.address && (
                                <div className="flex items-center gap-3 text-base font-medium">
                                    <IconMapPin className="size-4 text-accent" />
                                    <span>{user.address}</span>
                                </div>
                            )}
                            {user.email && (
                                <div className="flex items-center gap-3 text-base font-medium">
                                    <IconMail className="size-4 text-accent" />
                                    <a
                                        href={`mailto:${user.email}`}
                                        className="hover:text-accent transition-colors"
                                    >
                                        {user.email}
                                    </a>
                                </div>
                            )}
                            {user.phone && (
                                <div className="flex items-center gap-3 text-base font-medium">
                                    <IconPhone className="size-4 text-accent" />
                                    <span>+977 {user.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
                    <Button size="lg" asChild>
                        <a href="#contact">
                            <IconMail className="mr-2 size-4" />
                            Get in touch
                        </a>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <a href="#projects">
                            <IconFileText className="mr-2 size-4" />
                            View work
                        </a>
                    </Button>
                </div>

                <TooltipProvider delayDuration={0}>
                    <div className="flex items-center gap-5">
                        <SocialsSection />
                    </div>
                </TooltipProvider>
            </div>

            {/* Scroll Indicator */}
            <a
                href="#experience"
                className="absolute bottom-10 animate-bounce text-muted-foreground hover:text-accent transition-colors"
            >
                <IconArrowDown className="size-6" />
            </a>
        </section>
    );
}
