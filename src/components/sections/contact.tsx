"use client";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { IconArrowUpRight, IconMail } from "@tabler/icons-react";
import { SocialsSection } from "./socials";

export function ContactSection() {
    return (
        <section id="contact" className="px-6 py-24">
            <div className="mx-auto max-w-5xl">
                <SectionHeading title="Contact" />

                <div className="grid gap-12 md:grid-cols-2">
                    <div>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            {
                                "If you'd like to discuss a project, have a question, or just want to say hi \u2014 I'm always open to connecting."
                            }
                        </p>

                        <Button asChild className="mt-6 gap-2">
                            <a href={`mailto:gurungnishank@gmail.com`}>
                                <IconMail className="size-4" />
                                gurungnishank@gmail.com
                                <IconArrowUpRight className="size-3" />
                            </a>
                        </Button>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                            Social
                        </h3>

                        <TooltipProvider delayDuration={0}>
                            <div className="flex flex-wrap gap-2">
                                <SocialsSection />
                            </div>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </section>
    );
}
