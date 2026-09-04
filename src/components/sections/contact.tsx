"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
    IconArrowRight,
    IconCheck,
    IconCopy,
    IconMail,
    IconMapPin,
    IconPhone,
    IconSparkles,
} from "@tabler/icons-react";
import { SocialsSection } from "./socials";
import { QuickMessageForm } from "./QuickMessageForm";
import { useQueryGetUser } from "@/hooks/query-hooks/useQueryGetUser";
import { toast } from "sonner";

export function ContactSection() {
    const { data: user } = useQueryGetUser();
    const [copiedEmail, setCopiedEmail] = useState(false);

    const email = user?.email || "gurungnishank@gmail.com";

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopiedEmail(true);
            toast.success("Email copied to clipboard!");
            setTimeout(() => setCopiedEmail(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
            toast.error("Failed to copy email");
        }
    };

    return (
        <section id="contact" className="px-4 sm:px-6 py-24 sm:py-32 relative overflow-hidden">
            {/* Ambient Bottom Glow mirroring the Hero section */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[350px] w-[600px] sm:w-[800px] rounded-full bg-accent/15 blur-[140px] dark:bg-accent/10" />
            </div>

            <div className="mx-auto max-w-5xl">
                <SectionHeading
                    badge="Get In Touch"
                    title="Let's Build Something Exceptional"
                    description="Whether you have an upcoming project, want to collaborate, or simply say hi — my inbox is always open."
                />

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="rounded-3xl border border-border/70 bg-card/60 backdrop-blur-xl p-6 sm:p-10 shadow-sm"
                >
                    <div className="grid gap-10 md:grid-cols-12 items-start">
                        {/* Left Column: Direct Outreach & Connect Channels (5 cols) */}
                        <div className="md:col-span-5 space-y-6">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-medium">
                                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Actively Accepting Inquiries</span>
                                </div>

                                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                    Have a challenge or idea in mind?
                                </h3>

                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    I specialize in full-stack architecture, performant web & mobile applications, and intuitive user experiences. Drop a line and let&apos;s build something exceptional.
                                </p>
                            </div>

                            {/* Direct Actions & Info */}
                            <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <Button
                                        size="sm"
                                        className="group relative shadow-md shadow-accent/15 hover:shadow-accent/25 transition-all text-xs font-semibold"
                                        asChild
                                    >
                                        <a href={`mailto:${email}`}>
                                            <IconMail className="mr-1.5 size-3.5 group-hover:scale-110 transition-transform" />
                                            Direct Email
                                            <IconArrowRight className="ml-1.5 size-3.5 transition-transform group-hover:translate-x-1" />
                                        </a>
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleCopyEmail}
                                        className="border-border/80 hover:bg-muted transition-all text-xs font-semibold gap-1.5 shadow-xs"
                                    >
                                        {copiedEmail ? (
                                            <>
                                                <IconCheck className="size-3.5 text-emerald-500" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <IconCopy className="size-3.5 text-muted-foreground" />
                                                Copy Email
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <div className="pt-3 border-t border-border/40 space-y-2 text-xs text-muted-foreground">
                                    {user?.address && (
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 rounded-md bg-accent/10 text-accent shrink-0">
                                                <IconMapPin className="size-3.5" />
                                            </div>
                                            <span>{user.address}</span>
                                        </div>
                                    )}

                                    {user?.phone && (
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 rounded-md bg-accent/10 text-accent shrink-0">
                                                <IconPhone className="size-3.5" />
                                            </div>
                                            <a
                                                href={`tel:+977${user.phone.replace(/\s+/g, "")}`}
                                                className="hover:text-accent transition-colors"
                                            >
                                                +977 {user.phone}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Social Profiles */}
                            <div className="pt-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                                    Find Me Online
                                </h4>
                                <TooltipProvider delayDuration={0}>
                                    <div className="flex flex-wrap gap-2">
                                        <SocialsSection />
                                    </div>
                                </TooltipProvider>
                            </div>

                            {/* Timezone / Availability Stamp */}
                            <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50 text-xs font-mono text-muted-foreground flex items-center justify-between">
                                <span>Based in Nepal</span>
                                <span className="text-accent font-medium">UTC+05:45 (NPT)</span>
                            </div>
                        </div>

                        {/* Right Column: Quick Message Form (7 cols) */}
                        <div className="md:col-span-7 md:border-l md:border-border/50 md:pl-8 pt-8 md:pt-0 border-t border-border/40 md:border-t-0 space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <IconSparkles className="size-4 text-accent" />
                                    <h4 className="text-lg font-bold tracking-tight text-foreground">
                                        Send a Quick Message
                                    </h4>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Fill out the form below and your message will be delivered straight to my dashboard.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-border/60 bg-background/40 p-4 sm:p-6 shadow-xs">
                                <QuickMessageForm />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
