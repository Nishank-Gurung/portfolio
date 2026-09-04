"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { SectionHeading } from "@/components/section-heading";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQueryGetSkills } from "@/hooks/query-hooks/useQueryGetSkills";
import { Skeleton } from "../ui/skeleton";
import { Skill } from "@/generated/prisma/client";
import { Badge } from "../ui/badge";

export function SkillsSection() {
    const { data: skillsData, isLoading } = useQueryGetSkills();
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const skills: Skill[] = useMemo(() => skillsData || [], [skillsData]);

    // Extract categories
    const categories = useMemo(() => {
        const cats = new Set<string>();
        skills.forEach((s) => {
            if (s.category && s.category.trim()) {
                cats.add(s.category.trim());
            }
        });
        return ["All", ...Array.from(cats)];
    }, [skills]);

    // Filtered skills
    const filteredSkills = useMemo(() => {
        if (selectedCategory === "All") return skills;
        return skills.filter((s) => s.category?.trim() === selectedCategory);
    }, [skills, selectedCategory]);

    if (isLoading || !skillsData) {
        return (
            <section className="px-4 sm:px-6 py-24 max-w-5xl mx-auto">
                <div className="mb-12">
                    <Skeleton className="h-4 w-24 mb-2.5 rounded-full" />
                    <Skeleton className="h-9 w-44 mb-2 rounded-lg" />
                    <Skeleton className="h-4 w-60 rounded-md" />
                </div>

                <div className="flex gap-2 mb-8">
                    <Skeleton className="h-8 w-20 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-20 rounded-full" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 p-3.5 rounded-xl border border-border/50 bg-card"
                        >
                            <Skeleton className="size-9 rounded-lg shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-4 w-16 rounded-md" />
                                <Skeleton className="h-3 w-10 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section id="skills" className="px-4 sm:px-6 py-24 sm:py-28 relative">
            <div className="mx-auto max-w-5xl">
                <SectionHeading
                    badge="Arsenal & Technologies"
                    title="Skills & Tech Stack"
                    description="The modern languages, frameworks, libraries, and developer tools I leverage daily."
                />

                {/* Category Filter Chips */}
                {categories.length > 2 && (
                    <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10">
                        {categories.map((cat) => {
                            const isActive = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                                        isActive
                                            ? "text-white font-semibold border border-accent/40"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/50 bg-card/40"
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeSkillCategory"
                                            className="absolute inset-0 bg-accent rounded-full shadow-md shadow-accent/25"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{cat}</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Skills Interactive Grid */}
                <TooltipProvider delayDuration={100}>
                    <motion.div
                        layout
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredSkills.map((skill, index) => (
                                <motion.div
                                    layout
                                    key={skill.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: index * 0.02 }}
                                    whileHover={{ y: -3, scale: 1.02 }}
                                >
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="group relative flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border border-border/70 bg-card/60 backdrop-blur-md transition-all duration-200 hover:border-accent/40 hover:bg-card hover:shadow-md hover:shadow-accent/5 cursor-default">
                                                {/* Icon container */}
                                                <div className="size-10 shrink-0 flex items-center justify-center rounded-lg bg-secondary/80 border border-border/50 group-hover:border-accent/30 group-hover:scale-105 transition-all">
                                                    {skill.image ? (
                                                        <Image
                                                            src={skill.image}
                                                            alt={skill.name}
                                                            width={26}
                                                            height={26}
                                                            className="size-6 object-contain"
                                                        />
                                                    ) : (
                                                        <span className="text-xs font-bold text-accent">
                                                            {skill.name.slice(0, 2).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Skill name & category/level */}
                                                <div className="min-w-0 flex-1">
                                                    <span className="block text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                                                        {skill.name}
                                                    </span>
                                                    {skill.category ? (
                                                        <span className="block text-[10px] font-mono text-muted-foreground truncate">
                                                            {skill.category}
                                                        </span>
                                                    ) : skill.level ? (
                                                        <span className="block text-[10px] font-mono text-muted-foreground capitalize">
                                                            {skill.level.toLowerCase()}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </TooltipTrigger>

                                        <TooltipContent
                                            side="top"
                                            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground shadow-xl flex items-center gap-2"
                                        >
                                            <span>{skill.name}</span>
                                            {skill.level && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[10px] py-0 px-1 font-mono uppercase"
                                                >
                                                    {skill.level}
                                                </Badge>
                                            )}
                                        </TooltipContent>
                                    </Tooltip>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </TooltipProvider>
            </div>
        </section>
    );
}
