"use client";
import { SectionHeading } from "@/components/section-heading";
import { HtmlContent } from "@/components/html-content";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { IconExternalLink } from "@tabler/icons-react";
import { useQueryGetExperiences } from "@/hooks/query-hooks/useQueryGetExperiences";
import { experience } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";

const typeLabels: Record<string, string> = {
    FULL_TIME: "Full-time",
    INTERNSHIP: "Internship",
    FREELANCE: "Freelance",
    CONTRACT: "Contract",
    PART_TIME: "Part-time",
};

export function ExperienceSection() {
    const { data: experienceData, isLoading } = useQueryGetExperiences();

    if (isLoading || !experienceData?.data?.work) {
        return (
            <section className="px-6 py-24">
                <div className="mx-auto max-w-4xl">
                    {/* Section Heading Skeleton */}
                    <div className="mb-12">
                        <Skeleton className="h-10 w-48 mb-2" /> {/* Title */}
                        <Skeleton className="h-5 w-64" /> {/* Description */}
                    </div>

                    <div className="relative">
                        {/* Timeline line - Visible only on desktop */}
                        <div className="absolute left-0 top-0 hidden h-full w-px bg-border md:left-[140px] md:block" />

                        <div className="space-y-12">
                            {/* Generating 3 Experience Items */}
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="group relative md:pl-[180px]"
                                >
                                    {/* Date label Skeleton */}
                                    <div className="mb-2 md:absolute md:left-0 md:top-0 md:mb-0 md:w-[120px] md:text-right">
                                        <Skeleton className="h-4 w-24 ml-auto inline-block" />
                                    </div>

                                    {/* Timeline dot Skeleton */}
                                    <div className="absolute left-[-5px] top-[6px] hidden size-[10px] rounded-full border bg-muted md:left-[136px] md:block" />

                                    {/* Content Card Skeleton */}
                                    <div className="rounded-lg border border-transparent p-4">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <Skeleton className="h-6 w-40" />{" "}
                                            {/* Position */}
                                            <Skeleton className="h-4 w-4" />{" "}
                                            {/* "at" */}
                                            <Skeleton className="h-6 w-32" />{" "}
                                            {/* Company */}
                                            <Skeleton className="h-5 w-16 rounded-full" />{" "}
                                            {/* Type Badge */}
                                        </div>

                                        {/* Description (HtmlContent) Skeleton */}
                                        <div className="space-y-2 mb-4">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-[90%]" />
                                            <Skeleton className="h-4 w-[40%]" />
                                        </div>

                                        {/* Skills/Tags Skeleton */}
                                        <div className="flex flex-wrap gap-2">
                                            <Skeleton className="h-5 w-12 rounded-md" />
                                            <Skeleton className="h-5 w-16 rounded-md" />
                                            <Skeleton className="h-5 w-14 rounded-md" />
                                            <Skeleton className="h-5 w-20 rounded-md" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const experiences: experience[] = experienceData.data.work || [];
    return (
        <section id="experience" className="px-6 py-24">
            <div className="mx-auto max-w-4xl">
                <SectionHeading
                    title="Experience"
                    description="Where I've worked and what I've contributed."
                />

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-0 top-0 hidden h-full w-px bg-border md:left-[140px] md:block" />

                    <div className="space-y-12">
                        {experiences.map((exp) => (
                            <div
                                key={exp.id}
                                className="group relative md:pl-[180px]"
                            >
                                {/* Date label */}
                                <div className="mb-2 text-sm font-mono text-muted-foreground md:absolute md:left-0 md:top-0 md:mb-0 md:w-[120px] md:text-right">
                                    <span>
                                        {format(exp.startDate, "MMM yyyy")}
                                    </span>
                                    <span className="mx-1">{" \u2014 "}</span>
                                    <span>
                                        {exp.endDate
                                            ? format(exp.endDate, "MMM yyyy")
                                            : "Present"}
                                    </span>
                                </div>

                                {/* Timeline dot */}
                                <div className="absolute left-[-5px] top-[6px] hidden size-[10px] rounded-full border-2 border-accent bg-background md:left-[136px] md:block" />

                                <div className="rounded-lg border border-transparent p-4 transition-colors hover:border-border hover:bg-card">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-semibold text-foreground">
                                            {exp.position}
                                        </h3>
                                        <span className="text-muted-foreground">
                                            {"at"}
                                        </span>
                                        {exp.url ? (
                                            <a
                                                href={exp.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 font-semibold text-foreground underline underline-offset-4 decoration-border hover:decoration-accent transition-colors"
                                            >
                                                {exp.company}
                                                <IconExternalLink className="size-3" />
                                            </a>
                                        ) : (
                                            <span className="font-semibold text-foreground">
                                                {exp.company}
                                            </span>
                                        )}
                                        <Badge
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            {typeLabels[exp.type] || exp.type}
                                        </Badge>
                                        {exp.isCurrent && (
                                            <Badge className="bg-accent text-accent-foreground text-xs">
                                                Current
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="mt-2">
                                        <HtmlContent
                                            html={exp.description}
                                            className="text-sm"
                                        />
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {exp.skills.map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="outline"
                                                className="text-xs font-normal"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
