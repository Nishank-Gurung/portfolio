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
                        {/* Left Column: Direct Outreach & Quick Info (7 cols) */}
                        <div className="md:col-span-7 space-y-6">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-medium">
                                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Actively Accepting Inquiries</span>
                                </div>

                                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                    Have a challenge or idea in mind?
                                </h3>

                                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                                    I specialize in full-stack architecture, performant web applications, and intuitive user experiences. Drop a line and let&apos;s start a conversation.
                                </p>
                            </div>

                            {/* Direct Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <Button
                                    size="lg"
                                    className="group relative shadow-md shadow-accent/15 hover:shadow-accent/25 transition-all text-sm font-semibold"
                                    asChild
                                >
                                    <a href={`mailto:${email}`}>
                                        <IconMail className="mr-2 size-4 group-hover:scale-110 transition-transform" />
                                        Send Message
                                        <IconArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                                    </a>
                                </Button>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={handleCopyEmail}
                                    className="border-border/80 hover:bg-muted transition-all text-sm font-semibold gap-2 shadow-xs"
                                >
                                    {copiedEmail ? (
                                        <>
                                            <IconCheck className="size-4 text-emerald-500" />
                                            Email Copied!
                                        </>
                                    ) : (
                                        <>
                                            <IconCopy className="size-4 text-muted-foreground" />
                                            Copy Email
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Quick Info Items */}
                            <div className="pt-4 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {user?.address && (
                                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                                        <div className="p-1.5 rounded-lg bg-accent/10 text-accent shrink-0">
                                            <IconMapPin className="size-3.5" />
                                        </div>
                                        <span>{user.address}</span>
                                    </div>
                                )}

                                {user?.phone && (
                                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                                        <div className="p-1.5 rounded-lg bg-accent/10 text-accent shrink-0">
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

                        {/* Right Column: Social Channels (5 cols) */}
                        <div className="md:col-span-5 flex flex-col justify-between space-y-6 md:border-l md:border-border/50 md:pl-8 pt-6 md:pt-0 border-t border-border/40 md:border-t-0">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <IconSparkles className="size-4 text-accent" />
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                                        Connect Across the Web
                                    </h4>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                                    Find my code repositories, articles, career milestones, and daily dev thoughts on these platforms.
                                </p>

                                <TooltipProvider delayDuration={0}>
                                    <div className="flex flex-wrap gap-2.5 p-3 rounded-2xl border border-border/60 bg-muted/20">
                                        <SocialsSection />
                                    </div>
                                </TooltipProvider>
                            </div>

                            {/* Timezone / Availability Stamp */}
                            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-xs font-mono text-muted-foreground flex items-center justify-between">
                                <span>Based in Nepal</span>
                                <span className="text-accent font-medium">UTC+05:45 (NPT)</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
