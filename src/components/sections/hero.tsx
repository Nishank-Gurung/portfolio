"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { IconArrowDown, IconFileText, IconMail } from "@tabler/icons-react";
import { useQueryGetUser } from "@/hooks/query-hooks/useQueryGetUser";
import { useQueryGetSocials } from "@/hooks/query-hooks/useQueryGetSocials";
import { SocialIcon } from "./SocialIcon";
import { socialMedia, user } from "@/lib/types";
import { extractParagraphsOnly } from "@/lib/utils";
import { SocialsSection } from "./socials";

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim();
}

export function HeroSection() {
    const { data: userData, isLoading } = useQueryGetUser();

    if (isLoading || !userData?.data?.user) {
        return (
            <div className="min-h-dvh flex items-center justify-center">
                Loading...
            </div>
        );
    }
    const user: user = userData?.data.user;

    // const plainAbout = user.about ? stripHtml(user.about) : "";
    // Take just the first sentence or first 200 chars for the hero
    // const shortAbout = plainAbout.split(". ").slice(0, 2).join(". ") + ".";
    console.log(user);
    return (
        <section
            id="hero"
            className="relative flex min-h-dvh items-center justify-center px-6"
        >
            <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
                <Avatar className="mb-8 size-28 ring-2 ring-border ring-offset-4 ring-offset-background">
                    <AvatarImage src={user?.image} alt={user.name} />
                    <AvatarFallback className="text-2xl font-semibold bg-secondary text-secondary-foreground">
                        {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </AvatarFallback>
                </Avatar>

                <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
                    {user.title}
                </p>

                <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
                    {"Hi, I'm "}
                    <span className="text-gradient">{user.name}</span>
                </h1>

                {/* <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
                    {shortAbout}
                </p> */}
                <div
                    className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty"
                    dangerouslySetInnerHTML={{
                        __html: extractParagraphsOnly(user.about || ""),
                    }}
                />

                <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
                    <Button asChild>
                        <a href="#contact">
                            <IconMail className="size-4" />
                            Get in touch
                        </a>
                    </Button>
                    <Button variant="outline" asChild>
                        <a href="#projects">
                            <IconFileText className="size-4" />
                            View work
                        </a>
                    </Button>
                </div>

                <TooltipProvider delayDuration={0}>
                    <div className="flex items-center gap-4">
                        <SocialsSection />
                    </div>
                </TooltipProvider>
            </div>

            <a
                href="#about"
                className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Scroll to about"
            >
                <IconArrowDown className="size-5" />
            </a>
        </section>
    );
}
