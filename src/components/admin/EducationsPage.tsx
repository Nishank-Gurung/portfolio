"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { useEffect, useState, useMemo } from "react";
import { showErrorTost } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useQueryGetEducations } from "@/hooks/query-hooks/useQueryGetEducations";
import PageSkeleton from "../skeleton/PageSkeleton";
import { Education } from "@/generated/prisma/client";
import { useEducationMutation } from "@/hooks/mutation-hooks/education-mutation";
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
    IconCalendar,
    IconPencil,
    IconPlus,
    IconSchool,
    IconSearch,
    IconSparkles,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
import DeleteModal from "../global/DeleteModal";

export default function EducationsPage({ error }: { error?: string }) {
    const { data: educationData, isLoading } = useQueryGetEducations();
    const { deleteEducationMutation } = useEducationMutation();
    const router = useRouter();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedEducationId, setSelectedEducationId] = useState<number | null>(null);
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

    const education: Education[] = useMemo(() => educationData || [], [educationData]);

    // Metrics
    const totalCount = education.length;
    const activeCount = useMemo(() => education.filter((e) => e.isCurrent).length, [education]);
    const institutionsCount = useMemo(() => {
        const set = new Set<string>();
        education.forEach((e) => set.add(e.institution));
        return set.size;
    }, [education]);

    // Filtered by search query
    const filteredEducation = useMemo(() => {
        if (!searchQuery.trim()) return education;
        const q = searchQuery.toLowerCase();
        return education.filter(
            (e) =>
                e.institution.toLowerCase().includes(q) ||
                e.degree?.toLowerCase().includes(q) ||
                e.field?.toLowerCase().includes(q),
        );
    }, [education, searchQuery]);

    if (isLoading || !educationData) {
        return <PageSkeleton />;
    }

    const handleEdit = (edu: Education) => {
        router.push(`/admin/editor/education?id=${edu.id}`);
    };

    const handleDelete = (edu: Education) => {
        setSelectedEducationId(edu.id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedEducationId) return;
        deleteEducationMutation.mutate(selectedEducationId, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setSelectedEducationId(null);
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
                            <IconSchool className="size-6" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Education Management
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage your academic background, university degrees, majors, and credentials.
                    </p>
                </div>

                <Button asChild size="sm" className="font-semibold shadow-xs shrink-0">
                    <Link href="/admin/editor/education">
                        <IconPlus className="size-4 mr-1.5" />
                        Add Education
                    </Link>
                </Button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 shadow-xs border border-border/60">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase font-mono">
                                Total Entries
                            </span>
                            <span className="text-2xl font-bold text-foreground block mt-1">
                                {totalCount}
                            </span>
                        </div>
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                            <IconSchool className="size-5" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4 shadow-xs border border-border/60">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase font-mono">
                                Active Studies
                            </span>
                            <span className="text-2xl font-bold text-foreground block mt-1">
                                {activeCount}
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
                                Institutions
                            </span>
                            <span className="text-2xl font-bold text-foreground block mt-1">
                                {institutionsCount}
                            </span>
                        </div>
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                            <IconSchool className="size-5" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <IconSearch className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                        placeholder="Search by institution, degree, or field..."
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
            {filteredEducation.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="p-3 rounded-full bg-muted text-muted-foreground mb-4">
                            <IconSchool className="size-8" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground mb-1">
                            {searchQuery ? "No matching education found" : "No education registered yet"}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                            {searchQuery
                                ? `No education entries matched "${searchQuery}". Try clearing your search.`
                                : "Add university, college, or training programs to showcase your educational path."}
                        </p>
                        {searchQuery ? (
                            <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                                Clear Search
                            </Button>
                        ) : (
                            <Button asChild size="sm">
                                <Link href="/admin/editor/education">
                                    <IconPlus className="size-4 mr-1.5" />
                                    Add First Education
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
                                <TableHead>Institution</TableHead>
                                <TableHead>Degree & Major</TableHead>
                                <TableHead>Years</TableHead>
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEducation.map((edu) => (
                                <TableRow key={edu.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-foreground">
                                                {edu.institution}
                                            </span>
                                            {edu.isCurrent && (
                                                <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] py-0 px-1.5">
                                                    Current
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="text-sm">
                                            <span className="font-medium text-foreground">
                                                {edu.degree || "Degree"}
                                            </span>
                                            {edu.field && (
                                                <span className="text-muted-foreground">
                                                    {" in "}
                                                    <span className="text-foreground/80">{edu.field}</span>
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                                            <IconCalendar className="size-3 text-accent" />
                                            <span>
                                                {format(new Date(edu.startDate), "yyyy")} —{" "}
                                                {edu.endDate
                                                    ? format(new Date(edu.endDate), "yyyy")
                                                    : "Present"}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => handleEdit(edu)}
                                                className="text-muted-foreground hover:text-foreground hover:bg-muted"
                                                title="Edit Education"
                                            >
                                                <IconPencil className="size-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => handleDelete(edu)}
                                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                title="Delete Education"
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
                isPending={deleteEducationMutation.isPending}
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={handleConfirmDelete}
            />
        </div>
    );
}
