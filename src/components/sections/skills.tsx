"use client";

import { SectionHeading } from "@/components/section-heading";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQueryGetSkills } from "@/hooks/query-hooks/useQueryGetSkills";
import { skill } from "@/lib/types";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

export function SkillsSection() {
    const { data: skillsData, isLoading } = useQueryGetSkills();

    if (isLoading || !skillsData?.data?.skill) {
        return (
            <section className="px-6 py-24">
                <div className="mx-auto max-w-4xl">
                    {/* Section Heading Skeleton */}
                    <div className="mb-8">
                        <Skeleton className="h-10 w-32" />
                    </div>

                    {/* Flex Wrap Grid of Skill Tiles */}
                    <div className="flex flex-wrap gap-4">
                        {/* Generating 15 skill icon placeholders */}
                        {Array.from({ length: 15 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                className="size-12 rounded-lg border border-border/50"
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }
    const skills: skill[] = skillsData.data.skill || [];

    return (
        <section id="skills" className="px-6 py-24">
            <div className="mx-auto max-w-4xl">
                <SectionHeading title="Stack" />

                <TooltipProvider delayDuration={0}>
                    <div className="flex flex-wrap gap-4">
                        {skills.map((skill) => (
                            <Tooltip key={skill.id}>
                                <TooltipTrigger asChild>
                                    <div className="group flex size-12 items-center justify-center rounded-lg border border-border/50 bg-card transition-all duration-200 hover:border-accent/40 hover:scale-110 hover:shadow-lg hover:shadow-accent/5 cursor-default">
                                        {skill.image ? (
                                            <Image
                                                src={skill.image}
                                                alt={skill.name}
                                                width={28}
                                                height={28}
                                                className="size-7 object-contain"
                                            />
                                        ) : (
                                            <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                                                {skill.name
                                                    .slice(0, 2)
                                                    .toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="top"
                                    className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground shadow-xl"
                                >
                                    {skill.name}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </TooltipProvider>
            </div>
        </section>
    );
}
