"use client";
import { SectionHeading } from "@/components/section-heading";
import { HtmlContent } from "@/components/html-content";
import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import { useQueryGetUser } from "@/hooks/query-hooks/useQueryGetUser";
import { user } from "@/lib/types";
import { User } from "@/generated/prisma/client";


export function AboutSection() {
    const { data: userData, isLoading } = useQueryGetUser();

    if (isLoading || !userData) {
        return (
            <div className="min-h-dvh flex items-center justify-center">
                Loading...
            </div>
        );
    }
    const user: User = userData;
    return (
        <section id="about" className="px-6 py-24">
            <div className="mx-auto max-w-5xl">
                <SectionHeading title="About" />

                <div className="grid gap-12 md:grid-cols-[2fr_1fr]">
                    <div>
                        {user.about ? (
                            <HtmlContent
                                html={user.about}
                                // className="text-lg prose-p:my-1 prose-ul:my-2 prose-li:my-0 text-pretty"
                                className="font-mono text-[15px] leading-relaxed"
                            />
                        ) : null}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                            Details
                        </h3>
                        <div className="space-y-3">
                            {user.address && (
                                <div className="flex items-center gap-3 text-sm text-foreground">
                                    <IconMapPin className="size-4 shrink-0 text-accent" />
                                    <span>{user.address}</span>
                                </div>
                            )}
                            {user.email && (
                                <div className="flex items-center gap-3 text-sm text-foreground">
                                    <IconMail className="size-4 shrink-0 text-accent" />
                                    <a
                                        href={`mailto:${user.email}`}
                                        className="underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
                                    >
                                        {user.email}
                                    </a>
                                </div>
                            )}
                            {user.phone && (
                                <div className="flex items-center gap-3 text-sm text-foreground">
                                    <IconPhone className="size-4 shrink-0 text-accent" />
                                    <span>{user.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
