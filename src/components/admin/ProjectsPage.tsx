"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { useEffect, useState, useMemo } from "react";
import { showErrorTost } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useQueryGetProjects } from "@/hooks/query-hooks/useQueryGetProjects";
import PageSkeleton from "../skeleton/PageSkeleton";
import { Project } from "@/generated/prisma/client";
import { useProjectMutation } from "@/hooks/mutation-hooks/project-mutation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import {
    IconExternalLink,
    IconFolder,
    IconPencil,
    IconPlus,
    IconSearch,
    IconSparkles,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
import DeleteModal from "../global/DeleteModal";
import Image from "next/image";

export default function ProjectsPage({ error }: { error?: string }) {
    const { data: projectsData, isLoading } = useQueryGetProjects();
    const { deleteProjectMutation } = useProjectMutation();
    const router = useRouter();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (error) {
            showErrorTost(error);
            window.history.replaceState(
                null,
                "",
                `?${new URLSearchParams().toString()}`,
            );
        }
    }, [error]);

    const projects: Project[] = useMemo(() => projectsData || [], [projectsData]);

    // Metrics
    const totalCount = projects.length;
    const featuredCount = useMemo(() => projects.filter((p) => p.isFeatured).length, [projects]);
    const categoriesCount = useMemo(() => {
        const set = new Set<string>();
        projects.forEach((p) => p.category?.forEach((c) => set.add(c)));
        return set.size;
    }, [projects]);

    // Filtered by search query
    const filteredProjects = useMemo(() => {
        if (!searchQuery.trim()) return projects;
        const q = searchQuery.toLowerCase();
        return projects.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                p.category?.some((c) => c.toLowerCase().includes(q)) ||
                p.techStack?.some((t) => t.toLowerCase().includes(q)),
        );
    }, [projects, searchQuery]);

    if (isLoading || !projectsData) {
        return <PageSkeleton />;
    }

    const handleEdit = (project: Project) => {
        router.push(`/admin/editor/project?id=${project.id}`);
    };

    const handleDelete = (project: Project) => {
        setSelectedProjectId(project.id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedProjectId) return;
        deleteProjectMutation.mutate(selectedProjectId, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setSelectedProjectId(null);
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Executive Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border/60">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <IconFolder className="size-6" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Projects Management
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                        Create, update, and organize the portfolio applications showcased to visitors.
                    </p>
                </div>

                <Button asChild size="sm" className="font-semibold shadow-xs shrink-0">
                    <Link href="/admin/editor/project">
                        <IconPlus className="size-4 mr-1.5" />
                        Add Project
                    </Link>
                </Button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 shadow-xs border border-border/60">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase font-mono">
                                Total Projects
                            </span>
                            <span className="text-2xl font-bold text-foreground block mt-1">
                                {totalCount}
                            </span>
                        </div>
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                            <IconFolder className="size-5" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4 shadow-xs border border-border/60">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase font-mono">
                                Featured
                            </span>
                            <span className="text-2xl font-bold text-foreground block mt-1">
                                {featuredCount}
                            </span>
                        </div>
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                            <IconSparkles className="size-5" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4 shadow-xs border border-border/60">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase font-mono">
                                Categories
                            </span>
                            <span className="text-2xl font-bold text-foreground block mt-1">
                                {categoriesCount}
                            </span>
                        </div>
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                            <IconFolder className="size-5" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <IconSearch className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                        placeholder="Search by title, category, or tech stack..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-9 h-10 text-sm"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <IconX className="size-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Table or Empty State */}
            {filteredProjects.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="p-3 rounded-full bg-muted text-muted-foreground mb-4">
                            <IconFolder className="size-8" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground mb-1">
                            {searchQuery ? "No matching projects found" : "No projects created yet"}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                            {searchQuery
                                ? `No project entries matched "${searchQuery}". Try a different search term or clear the filter.`
                                : "Add your first project to display it on your public portfolio website."}
                        </p>
                        {searchQuery ? (
                            <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                                Clear Search
                            </Button>
                        ) : (
                            <Button asChild size="sm">
                                <Link href="/admin/editor/project">
                                    <IconPlus className="size-4 mr-1.5" />
                                    Add First Project
                                </Link>
                            </Button>
                        )}
                    </div>
                </Card>
            ) : (
                <div className="rounded-xl border border-border/70 overflow-hidden bg-card/60 shadow-xs">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/40 hover:bg-muted/40">
                                <TableHead className="w-[60px]">Image</TableHead>
                                <TableHead>Project Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Tech Stack</TableHead>
                                <TableHead>Live URL</TableHead>
                                <TableHead className="w-[110px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProjects.map((project) => (
                                <TableRow key={project.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        {project.image ? (
                                            <div className="size-10 rounded-lg overflow-hidden border border-border/60 bg-muted relative shrink-0">
                                                <Image
                                                    src={project.image}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="size-10 rounded-lg border border-border/60 bg-muted flex items-center justify-center text-muted-foreground text-xs font-mono">
                                                N/A
                                            </div>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-foreground block">
                                                {project.title}
                                            </span>
                                            {project.isFeatured && (
                                                <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/30 text-[10px] py-0 px-1.5">
                                                    Featured
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {project.category?.map((cat) => (
                                                <Badge
                                                    key={cat}
                                                    variant="secondary"
                                                    className="text-[11px] font-normal"
                                                >
                                                    {cat}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                            {project.techStack?.slice(0, 3).map((tech) => (
                                                <Badge
                                                    key={tech}
                                                    variant="outline"
                                                    className="text-[10px] font-mono py-0"
                                                >
                                                    {tech}
                                                </Badge>
                                            ))}
                                            {(project.techStack?.length || 0) > 3 && (
                                                <span className="text-[10px] text-muted-foreground self-center">
                                                    +{(project.techStack?.length || 0) - 3}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        {project.url ? (
                                            <a
                                                href={project.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent truncate max-w-[180px] transition-colors"
                                                title={project.url}
                                            >
                                                <span className="truncate">{project.url.replace(/^https?:\/\//, "")}</span>
                                                <IconExternalLink className="size-3 shrink-0" />
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground text-xs font-mono">—</span>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => handleEdit(project)}
                                                className="text-muted-foreground hover:text-foreground hover:bg-muted"
                                                title="Edit Project"
                                            >
                                                <IconPencil className="size-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => handleDelete(project)}
                                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                title="Delete Project"
                                            >
                                                <IconTrash className="size-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <DeleteModal
                isPending={deleteProjectMutation.isPending}
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={handleConfirmDelete}
            />
        </div>
    );
}
