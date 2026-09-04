"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { SectionHeading } from "@/components/section-heading";
import { HtmlContent } from "@/components/html-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    IconArrowUpRight,
    IconExternalLink,
    IconSparkles,
} from "@tabler/icons-react";
import { useQueryGetProjects } from "@/hooks/query-hooks/useQueryGetProjects";
import { Skeleton } from "../ui/skeleton";
import { Project } from "@/generated/prisma/client";

export function ProjectsSection() {
    const { data: projects, isLoading } = useQueryGetProjects();
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    // Extract all unique categories
    const categories = useMemo(() => {
        if (!projects) return ["All"];
        const cats = new Set<string>();
        projects.forEach((p) => {
            p.category?.forEach((c) => cats.add(c));
        });
        return ["All", ...Array.from(cats)];
    }, [projects]);

    // Filter projects based on active category
    const filteredProjects = useMemo(() => {
        if (!projects) return [];
        if (selectedCategory === "All") return projects;
        return projects.filter((p) => p.category?.includes(selectedCategory));
    }, [projects, selectedCategory]);

    if (isLoading || !projects) {
        return (
            <section className="px-4 sm:px-6 py-24 max-w-5xl mx-auto">
                <div className="mb-12">
                    <Skeleton className="h-4 w-24 mb-2.5 rounded-full" />
                    <Skeleton className="h-9 w-48 mb-2 rounded-lg" />
                    <Skeleton className="h-4 w-64 rounded-md" />
                </div>

                <div className="flex gap-2 mb-8">
                    <Skeleton className="h-8 w-20 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-20 rounded-full" />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-border/50 bg-card overflow-hidden"
                        >
                            <Skeleton className="h-52 w-full rounded-none" />
                            <div className="p-6 space-y-4">
                                <Skeleton className="h-6 w-3/4 rounded-md" />
                                <Skeleton className="h-4 w-full rounded-md" />
                                <Skeleton className="h-4 w-4/5 rounded-md" />
                                <div className="flex gap-2 pt-2">
                                    <Skeleton className="h-5 w-14 rounded-md" />
                                    <Skeleton className="h-5 w-16 rounded-md" />
                                    <Skeleton className="h-5 w-12 rounded-md" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section id="projects" className="px-4 sm:px-6 py-24 sm:py-28 relative">
            <div className="mx-auto max-w-5xl">
                <SectionHeading
                    badge="Portfolio"
                    title="Featured Projects"
                    description="A curated selection of software applications, tools, and digital experiences I've engineered."
                />

                {/* Category Filter Tabs */}
                {categories.length > 2 && (
                    <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10">
                        {categories.map((category) => {
                            const isActive = selectedCategory === category;
                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setSelectedCategory(category)}
                                    className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                                        isActive
                                            ? "text-white font-semibold border border-accent/40"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/50 bg-card/40"
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeProjectCategory"
                                            className="absolute inset-0 bg-accent rounded-full shadow-md shadow-accent/25"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{category}</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Projects Grid */}
                <motion.div layout className="grid gap-6 md:grid-cols-2">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project: Project, index) => (
                            <motion.article
                                layout
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.35, delay: index * 0.05 }}
                                className="group relative flex flex-col rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl overflow-hidden shadow-xs transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5"
                            >
                                {/* Project Thumbnail Container */}
                                {project.image && (
                                    <div className="relative h-52 w-full overflow-hidden bg-muted">
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-black/30 opacity-80" />

                                        {/* Category Overlays */}
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                                            {project.category?.map((cat) => (
                                                <Badge
                                                    key={cat}
                                                    variant="secondary"
                                                    className="bg-background/80 backdrop-blur-md text-[11px] font-medium border border-border/60 shadow-xs"
                                                >
                                                    {cat}
                                                </Badge>
                                            ))}
                                            {project.isFeatured && (
                                                <Badge className="bg-accent/90 text-accent-foreground text-[11px] font-medium gap-1 shadow-xs">
                                                    <IconSparkles className="size-3" />
                                                    Featured
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Quick Links Floating Toolbar */}
                                        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                                            {project.url && (
                                                <>
                                                    <Button
                                                        variant="secondary"
                                                        size="icon-xs"
                                                        className="size-8 rounded-full bg-background/80 backdrop-blur-md border border-border/60 hover:bg-background text-foreground shadow-xs hover:border-accent/40"
                                                        asChild
                                                    >
                                                        <a
                                                            href={project.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            aria-label={`${project.title} source or demo`}
                                                            title="Visit Project"
                                                        >
                                                            <IconExternalLink className="size-3.5" />
                                                        </a>
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Card Body */}
                                <div className="flex flex-col flex-1 p-5 sm:p-6">
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors flex items-center gap-1.5">
                                            {project.title}
                                            <IconArrowUpRight className="size-4 opacity-0 -translate-x-1 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-accent" />
                                        </h3>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-4 flex-1 text-sm text-muted-foreground leading-relaxed">
                                        <HtmlContent html={project.description} />
                                    </div>

                                    {/* Tech Stack Pills */}
                                    {project.techStack && project.techStack.length > 0 && (
                                        <div className="mt-auto pt-3 border-t border-border/40 flex flex-wrap gap-1.5">
                                            {project.techStack.map((tech) => (
                                                <Badge
                                                    key={tech}
                                                    variant="outline"
                                                    className="text-[11px] font-mono font-normal bg-background/50 border-border/60 group-hover:border-accent/30 transition-colors"
                                                >
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Full Card Hit Link */}
                                {project.url && (
                                    <a
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 z-10"
                                        aria-label={`Open ${project.title}`}
                                    >
                                        <span className="sr-only">Open {project.title}</span>
                                    </a>
                                )}
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
