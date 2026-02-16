"use client";
import { SectionHeading } from "@/components/section-heading";
import { HtmlContent } from "@/components/html-content";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { IconExternalLink } from "@tabler/icons-react";
import { useQueryGetExperiences } from "@/hooks/query-hooks/useQueryGetExperiences";
import { experience } from "@/lib/types";

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
            <div className="min-h-dvh flex items-center justify-center">
                Loading...
            </div>
        );
    }

    const experiences: experience[] = experienceData.data.work || [];
    return (
        <section id="experience" className="px-6 py-24">
            <div className="mx-auto max-w-5xl">
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
