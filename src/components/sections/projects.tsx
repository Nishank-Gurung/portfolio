"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { HtmlContent } from "@/components/html-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    IconArrowUpRight,
    IconBrandGithub,
    IconExternalLink,
} from "@tabler/icons-react";
import { project } from "@/lib/types";
import { useQueryGetProjects } from "@/hooks/query-hooks/useQueryGetProjects";

export function ProjectsSection() {
    const { data: projects, isLoading } = useQueryGetProjects();

    if (isLoading || !projects?.data?.project) {
        return (
            <div className="min-h-dvh flex items-center justify-center">
                Loading...
            </div>
        );
    }

    const featured: project[] = projects.data.project || [];
    return (
        <section id="projects" className="px-6 py-24">
            <div className="mx-auto max-w-5xl">
                <SectionHeading
                    title="Projects"
                    description="A selection of things I've built."
                />

                <div className="grid gap-6 md:grid-cols-2">
                    {featured.map((project) => (
                        <article
                            key={project.id}
                            className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
                        >
                            {project.image && (
                                <div className="relative h-48 w-full overflow-hidden bg-muted">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>
                            )}

                            <div className="flex flex-col p-6">
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex flex-wrap gap-1.5">
                                        {project.category.map((cat) => (
                                            <Badge
                                                key={cat}
                                                variant="secondary"
                                                className="text-xs font-normal"
                                            >
                                                {cat}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="relative z-20 flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            asChild
                                        >
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`${project.title} source code`}
                                            >
                                                <IconBrandGithub className="size-4" />
                                            </a>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            asChild
                                        >
                                            <a
                                                href={project.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`${project.title} live demo`}
                                            >
                                                <IconExternalLink className="size-4" />
                                            </a>
                                        </Button>
                                    </div>
                                </div>

                                <h3 className="mb-2 text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                                    {project.title}
                                </h3>

                                <div className="mb-4 flex-1">
                                    <HtmlContent
                                        html={project.description}
                                        className="text-sm"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                    {project.techStack.map((tech) => (
                                        <Badge
                                            key={tech}
                                            variant="outline"
                                            className="text-xs font-mono font-normal"
                                        >
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 z-10"
                                aria-label={`View ${project.title}`}
                            >
                                <span className="sr-only">View project</span>
                            </a>

                            <IconArrowUpRight className="absolute right-6 top-6 size-5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-accent" />
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
