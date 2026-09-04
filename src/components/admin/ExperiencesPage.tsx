"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { useEffect, useState, useMemo } from "react";
import { showErrorTost } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useQueryGetExperiences } from "@/hooks/query-hooks/useQueryGetExperiences";
import PageSkeleton from "../skeleton/PageSkeleton";
import { WorkExperience } from "@/generated/prisma/client";
import { useWorkMutation } from "@/hooks/mutation-hooks/work-mutation";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import {
    IconBriefcase,
    IconCalendar,
    IconExternalLink,
    IconPencil,
    IconPlus,
    IconSearch,
    IconSparkles,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
import DeleteModal from "../global/DeleteModal";

const typeLabels: Record<string, string> = {
    FULL_TIME: "Full-time",
    INTERNSHIP: "Internship",
    FREELANCE: "Freelance",
    CONTRACT: "Contract",
    PART_TIME: "Part-time",
};

export default function ExperiencesPage({ error }: { error?: string }) {
    const { data: experienceData, isLoading } = useQueryGetExperiences();
    const { deleteWorkMutation } = useWorkMutation();
    const router = useRouter();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedExperienceId, setSelectedExperienceId] = useState<number | null>(null);
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

    const experiences: WorkExperience[] = useMemo(
        () => experienceData || [],
        [experienceData],
    );

    // Metrics
    const totalCount = experiences.length;
    const currentCount = useMemo(
        () => experiences.filter((e) => e.isCurrent).length,
        [experiences],
    );
    const companiesCount = useMemo(() => {
        const set = new Set<string>();
        experiences.forEach((e) => set.add(e.company));
        return set.size;
    }, [experiences]);

    // Filtered by search query
    const filteredExperiences = useMemo(() => {
        if (!searchQuery.trim()) return experiences;
        const q = searchQuery.toLowerCase();
        return experiences.filter(
            (e) =>
                e.company.toLowerCase().includes(q) ||
                e.position.toLowerCase().includes(q) ||
                e.skills?.some((s) => s.toLowerCase().includes(q)),
        );
    }, [experiences, searchQuery]);

    if (isLoading || !experienceData) {
        return <PageSkeleton />;
    }

    const handleEdit = (exp: WorkExperience) => {
        router.push(`/admin/editor/experience?id=${exp.id}`);
    };

    const handleDelete = (exp: WorkExperience) => {
        setSelectedExperienceId(exp.id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedExperienceId) return;
        deleteWorkMutation.mutate(selectedExperienceId, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setSelectedExperienceId(null);
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border/60">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <IconBriefcase className="size-6" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Experience Management
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage your professional work history, roles, employment types, and skill attributions.
                    </p>
                </div>

                <Button asChild size="sm" className="font-semibold shadow-xs shrink-0">
                    <Link href="/admin/editor/experience">
                        <IconPlus className="size-4 mr-1.5" />
                        Add Experience
                    </Link>
                </Button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 shadow-xs border border-border/60">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase font-mono">
                                Total Roles
                            </span>
                            <span className="text-2xl font-bold text-foreground block mt-1">
                                {totalCount}
                            </span>
                        </div>
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                            <IconBriefcase className="size-5" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4 shadow-xs border border-border/60">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase font-mono">
                                Active Positions
                            </span>
                            <span className="text-2xl font-bold text-foreground block mt-1">
                                {currentCount}
                            </span>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                            <IconSparkles className="size-5" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4 shadow-xs border border-border/60">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase font-mono">
                                Unique Companies
                            </span>
                            <span className="text-2xl font-bold text-foreground block mt-1">
                                {companiesCount}
                            </span>
                        </div>
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                            <IconBriefcase className="size-5" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <IconSearch className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                        placeholder="Search by company, position, or skills..."
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
            {filteredExperiences.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="p-3 rounded-full bg-muted text-muted-foreground mb-4">
                            <IconBriefcase className="size-8" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground mb-1">
                            {searchQuery ? "No matching experiences found" : "No experience recorded yet"}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                            {searchQuery
                                ? `No experience entries matched "${searchQuery}". Try clearing the search filter.`
                                : "Add your work history entries to showcase your professional career timeline."}
                        </p>
                        {searchQuery ? (
                            <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                                Clear Search
                            </Button>
                        ) : (
                            <Button asChild size="sm">
                                <Link href="/admin/editor/experience">
                                    <IconPlus className="size-4 mr-1.5" />
                                    Add First Experience
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
                                <TableHead>Company & Link</TableHead>
                                <TableHead>Position & Status</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Dates</TableHead>
                                <TableHead>Skills</TableHead>
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredExperiences.map((exp) => (
                                <TableRow key={exp.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 font-semibold text-foreground">
                                            {exp.company}
                                            {exp.url && (
                                                <a
                                                    href={exp.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-muted-foreground hover:text-accent"
                                                    title={exp.url}
                                                >
                                                    <IconExternalLink className="size-3" />
                                                </a>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-foreground">
                                                {exp.position}
                                            </span>
                                            {exp.isCurrent && (
                                                <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] py-0 px-1.5 gap-1">
                                                    <span className="size-1.5 rounded-full bg-emerald-500" />
                                                    Current
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant="secondary" className="text-xs font-normal">
                                            {typeLabels[exp.type] || exp.type}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                                            <IconCalendar className="size-3 text-accent" />
                                            <span>
                                                {format(new Date(exp.startDate), "MMM yyyy")} —{" "}
                                                {exp.endDate
                                                    ? format(new Date(exp.endDate), "MMM yyyy")
                                                    : "Present"}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                            {exp.skills?.slice(0, 3).map((s) => (
                                                <Badge key={s} variant="outline" className="text-[10px] font-mono py-0">
                                                    {s}
                                                </Badge>
                                            ))}
                                            {(exp.skills?.length || 0) > 3 && (
                                                <span className="text-[10px] text-muted-foreground self-center">
                                                    +{(exp.skills?.length || 0) - 3}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => handleEdit(exp)}
                                                className="text-muted-foreground hover:text-foreground hover:bg-muted"
                                                title="Edit Experience"
                                            >
                                                <IconPencil className="size-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => handleDelete(exp)}
                                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                title="Delete Experience"
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
                isPending={deleteWorkMutation.isPending}
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={handleConfirmDelete}
            />
        </div>
    );
}
