"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/section-heading";
import { HtmlContent } from "@/components/html-content";
import { format } from "date-fns";
import { IconCalendar, IconSchool, IconSparkles } from "@tabler/icons-react";
import { useQueryGetEducations } from "@/hooks/query-hooks/useQueryGetEducations";
import { Skeleton } from "../ui/skeleton";
import { Education } from "@/generated/prisma/client";
import { Badge } from "../ui/badge";

export function EducationSection() {
    const { data: educationData, isLoading } = useQueryGetEducations();

    if (isLoading || !educationData) {
        return (
            <section className="px-4 sm:px-6 py-24 max-w-5xl mx-auto">
                <div className="mb-12">
                    <Skeleton className="h-4 w-28 mb-2.5 rounded-full" />
                    <Skeleton className="h-9 w-44 mb-2 rounded-lg" />
                    <Skeleton className="h-4 w-64 rounded-md" />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex gap-4 rounded-2xl border border-border/50 bg-card p-6"
                        >
                            <Skeleton className="size-12 shrink-0 rounded-xl" />
                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-6 w-3/4 rounded-md" />
                                <Skeleton className="h-4 w-1/2 rounded-md" />
                                <Skeleton className="h-4 w-1/3 rounded-md" />
                                <div className="space-y-2 pt-2">
                                    <Skeleton className="h-3 w-full rounded-md" />
                                    <Skeleton className="h-3 w-4/5 rounded-md" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    const education: Education[] = educationData || [];

    return (
        <section id="education" className="px-4 sm:px-6 py-24 sm:py-28 relative">
            <div className="mx-auto max-w-5xl">
                <SectionHeading
                    badge="Academic Background"
                    title="Education"
                    description="Degrees, academic coursework, and educational milestones."
                />

                <div className="grid gap-6 md:grid-cols-2">
                    {education.map((edu, index) => {
                        const startYear = format(new Date(edu.startDate), "yyyy");
                        const endYear = edu.endDate
                            ? format(new Date(edu.endDate), "yyyy")
                            : "Present";

                        return (
                            <motion.div
                                key={edu.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{
                                    duration: 0.45,
                                    delay: index * 0.1,
                                    ease: "easeOut",
                                }}
                                className="group relative flex flex-col sm:flex-row items-start gap-4 sm:gap-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl p-6 sm:p-7 shadow-xs transition-all duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
                            >
                                {/* School Icon Box */}
                                <div className="size-12 shrink-0 flex items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent group-hover:scale-105 group-hover:bg-accent/15 transition-all shadow-xs">
                                    <IconSchool className="size-6" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    {/* Institution & Current badge */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                        <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
                                            {edu.institution}
                                        </h3>
                                        {edu.isCurrent && (
                                            <Badge className="bg-accent/20 text-accent border border-accent/30 text-[10px] font-medium px-2 py-0.5 gap-1">
                                                <IconSparkles className="size-3" />
                                                Active
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Degree & Field */}
                                    <p className="text-sm font-medium text-foreground/80">
                                        {edu.degree}
                                        {edu.field && (
                                            <span className="text-muted-foreground">
                                                {" in "}
                                                <span className="text-foreground/90 font-semibold">
                                                    {edu.field}
                                                </span>
                                            </span>
                                        )}
                                    </p>

                                    {/* Date Range Badge */}
                                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-md border border-border/50">
                                        <IconCalendar className="size-3 text-accent" />
                                        <span>
                                            {startYear} — {endYear}
                                        </span>
                                    </div>

                                    {/* Optional Description */}
                                    {edu.description && (
                                        <div className="mt-3.5 pt-3 border-t border-border/40 text-sm text-muted-foreground leading-relaxed">
                                            <HtmlContent html={edu.description} />
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
