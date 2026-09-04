"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/section-heading";
import { HtmlContent } from "@/components/html-content";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { IconCalendar, IconExternalLink, IconSparkles } from "@tabler/icons-react";
import { useQueryGetExperiences } from "@/hooks/query-hooks/useQueryGetExperiences";
import { Skeleton } from "../ui/skeleton";
import { WorkExperience } from "@/generated/prisma/client";

const typeLabels: Record<string, string> = {
    FULL_TIME: "Full-time",
    INTERNSHIP: "Internship",
    FREELANCE: "Freelance",
    CONTRACT: "Contract",
    PART_TIME: "Part-time",
};

export function ExperienceSection() {
    const { data: experienceData, isLoading } = useQueryGetExperiences();

    if (isLoading || !experienceData) {
        return (
            <section className="px-4 sm:px-6 py-24 max-w-5xl mx-auto">
                <div className="mb-12">
                    <Skeleton className="h-4 w-28 mb-2.5 rounded-full" />
                    <Skeleton className="h-9 w-52 mb-2 rounded-lg" />
                    <Skeleton className="h-4 w-72 rounded-md" />
                </div>

                <div className="relative pl-6 md:pl-10 border-l border-border/50 space-y-10 ml-3 md:ml-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="relative space-y-4">
                            <Skeleton className="absolute -left-[31px] md:-left-[47px] top-1.5 size-4 rounded-full" />
                            <div className="rounded-2xl border border-border/50 p-6 space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <Skeleton className="h-6 w-48 rounded-md" />
                                    <Skeleton className="h-5 w-28 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-full rounded-md" />
                                <Skeleton className="h-4 w-4/5 rounded-md" />
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <Skeleton className="h-5 w-16 rounded-md" />
                                    <Skeleton className="h-5 w-20 rounded-md" />
                                    <Skeleton className="h-5 w-14 rounded-md" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    const experiences: WorkExperience[] = experienceData || [];

    return (
        <section id="experience" className="px-4 sm:px-6 py-24 sm:py-28 relative">
            <div className="mx-auto max-w-5xl">
                <SectionHeading
                    badge="Career Journey"
                    title="Work Experience"
                    description="A timeline of my professional roles, engineering contributions, and key accomplishments."
                />

                <div className="relative ml-2 sm:ml-4 pl-6 sm:pl-10 border-l-2 border-border/60 space-y-10 sm:space-y-12">
                    {experiences.map((exp, index) => {
                        const isCurrent = exp.isCurrent;
                        const startDateStr = format(new Date(exp.startDate), "MMM yyyy");
                        const endDateStr = exp.endDate
                            ? format(new Date(exp.endDate), "MMM yyyy")
                            : "Present";

                        return (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.08,
                                    ease: "easeOut",
                                }}
                                className="relative group"
                            >
                                {/* Timeline Rail Node */}
                                <div className="absolute -left-[31px] sm:-left-[47px] top-4 flex items-center justify-center">
                                    {isCurrent ? (
                                        <div className="relative flex items-center justify-center">
                                            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-accent opacity-75" />
                                            <span className="relative inline-flex size-3.5 rounded-full bg-accent ring-4 ring-background shadow-sm" />
                                        </div>
                                    ) : (
                                        <div className="size-3.5 rounded-full border-2 border-accent/60 bg-background ring-4 ring-background transition-colors group-hover:border-accent group-hover:bg-accent/20" />
                                    )}
                                </div>

                                {/* Experience Card */}
                                <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl p-5 sm:p-7 shadow-xs transition-all duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
                                    {/* Header Row: Role, Company & Badges */}
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
                                                    {exp.position}
                                                </h3>

                                                <span className="text-muted-foreground text-sm font-normal">
                                                    at
                                                </span>

                                                {exp.url ? (
                                                    <a
                                                        href={exp.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 font-semibold text-foreground underline underline-offset-4 decoration-border/60 hover:text-accent hover:decoration-accent transition-colors"
                                                    >
                                                        {exp.company}
                                                        <IconExternalLink className="size-3.5 text-muted-foreground" />
                                                    </a>
                                                ) : (
                                                    <span className="font-semibold text-foreground">
                                                        {exp.company}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Date Badge */}
                                            <div className="mt-1.5 flex items-center gap-2 text-xs font-mono text-muted-foreground">
                                                <IconCalendar className="size-3.5 text-accent" />
                                                <span>
                                                    {startDateStr} — {endDateStr}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status & Type Pills */}
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <Badge
                                                variant="secondary"
                                                className="text-xs font-medium px-2.5 py-0.5"
                                            >
                                                {typeLabels[exp.type] || exp.type}
                                            </Badge>
                                            {isCurrent && (
                                                <Badge className="bg-accent/20 text-accent border border-accent/30 text-xs font-medium px-2.5 py-0.5 gap-1">
                                                    <IconSparkles className="size-3" />
                                                    Current
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description Body */}
                                    {exp.description && (
                                        <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
                                            <HtmlContent html={exp.description} />
                                        </div>
                                    )}

                                    {/* Skill Tags */}
                                    {exp.skills && exp.skills.length > 0 && (
                                        <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap gap-1.5">
                                            {exp.skills.map((skill) => (
                                                <Badge
                                                    key={skill}
                                                    variant="outline"
                                                    className="text-[11px] font-mono font-normal bg-background/50 border-border/60 hover:border-accent/40 hover:bg-accent/10 transition-colors"
                                                >
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
