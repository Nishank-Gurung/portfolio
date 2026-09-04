"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { useEffect, useState, useMemo } from "react";
import { showErrorTost } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useQueryGetSkills } from "@/hooks/query-hooks/useQueryGetSkills";
import PageSkeleton from "../skeleton/PageSkeleton";
import { Skill } from "@/generated/prisma/client";
import { useSkillMutation } from "@/hooks/mutation-hooks/skill-mutation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import {
    IconCode,
    IconPencil,
    IconPhoto,
    IconPlus,
    IconSearch,
    IconTools,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
import DeleteModal from "../global/DeleteModal";
import Image from "next/image";

export default function SkillsPage({ error }: { error?: string }) {
    const { data: skillsData, isLoading } = useQueryGetSkills();
    const { deleteSkillMutation } = useSkillMutation();
    const router = useRouter();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
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

    const skills: Skill[] = useMemo(() => skillsData || [], [skillsData]);

    // Metrics
    const totalCount = skills.length;
    const categoriesCount = useMemo(() => {
        const set = new Set<string>();
        skills.forEach((s) => {
            if (s.category && s.category.trim()) set.add(s.category.trim());
        });
        return set.size;
    }, [skills]);
    const withIconCount = useMemo(
        () => skills.filter((s) => s.image && s.image.trim().length > 0).length,
        [skills],
    );

    // Filtered by search query
    const filteredSkills = useMemo(() => {
        if (!searchQuery.trim()) return skills;
        const q = searchQuery.toLowerCase();
        return skills.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.category?.toLowerCase().includes(q) ||
                s.level?.toLowerCase().includes(q),
        );
    }, [skills, searchQuery]);

    if (isLoading || !skillsData) {
        return <PageSkeleton />;
    }

    const handleEdit = (skill: Skill) => {
        router.push(`/admin/editor/skill?id=${skill.id}`);
    };

    const handleDelete = (skill: Skill) => {
        setSelectedSkillId(skill.id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedSkillId) return;
        deleteSkillMutation.mutate(selectedSkillId, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setSelectedSkillId(null);
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
                            <IconTools className="size-6" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Skills & Technologies
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage your tech stack, programming languages, libraries, and proficiency ratings.
                    </p>
                </div>

                <Button asChild size="sm" className="font-semibold shadow-xs shrink-0">
                    <Link href="/admin/editor/skill">
                        <IconPlus className="size-4 mr-1.5" />
                        Add Skill
                    </Link>
                </Button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 shadow-xs border border-border/60">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase font-mono">
                                Total Skills
                            </span>
                            <span className="text-2xl font-bold text-foreground block mt-1">
                                {totalCount}
                            </span>
                        </div>
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                            <IconTools className="size-5" />
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
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                            <IconCode className="size-5" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4 shadow-xs border border-border/60">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase font-mono">
                                With Custom Icons
                            </span>
                            <span className="text-2xl font-bold text-foreground block mt-1">
                                {withIconCount}
                            </span>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                            <IconPhoto className="size-5" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <IconSearch className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                        placeholder="Search by skill name, category, or level..."
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
            {filteredSkills.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="p-3 rounded-full bg-muted text-muted-foreground mb-4">
                            <IconTools className="size-8" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground mb-1">
                            {searchQuery ? "No matching skills found" : "No skills registered yet"}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                            {searchQuery
                                ? `No skill entries matched "${searchQuery}". Try clearing your search.`
                                : "Add programming languages, frameworks, and developer tools to showcase in your stack."}
                        </p>
                        {searchQuery ? (
                            <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                                Clear Search
                            </Button>
                        ) : (
                            <Button asChild size="sm">
                                <Link href="/admin/editor/skill">
                                    <IconPlus className="size-4 mr-1.5" />
                                    Add First Skill
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
                                <TableHead className="w-[60px]">Icon</TableHead>
                                <TableHead>Skill Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Proficiency Level</TableHead>
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSkills.map((skill) => (
                                <TableRow key={skill.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <div className="size-10 rounded-lg overflow-hidden border border-border/60 bg-secondary/80 flex items-center justify-center relative shrink-0">
                                            {skill.image ? (
                                                <Image
                                                    src={skill.image}
                                                    alt={skill.name}
                                                    width={24}
                                                    height={24}
                                                    className="size-6 object-contain"
                                                />
                                            ) : (
                                                <span className="text-xs font-bold text-accent">
                                                    {skill.name.slice(0, 2).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <span className="font-semibold text-foreground">
                                            {skill.name}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        {skill.category ? (
                                            <Badge variant="secondary" className="text-[11px] font-normal">
                                                {skill.category}
                                            </Badge>
                                        ) : (
                                            <span className="text-xs text-muted-foreground font-mono">—</span>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {skill.level ? (
                                            <Badge variant="outline" className="text-[10px] font-mono uppercase">
                                                {skill.level}
                                            </Badge>
                                        ) : (
                                            <span className="text-xs text-muted-foreground font-mono">—</span>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => handleEdit(skill)}
                                                className="text-muted-foreground hover:text-foreground hover:bg-muted"
                                                title="Edit Skill"
                                            >
                                                <IconPencil className="size-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => handleDelete(skill)}
                                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                title="Delete Skill"
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
                isPending={deleteSkillMutation.isPending}
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={handleConfirmDelete}
            />
        </div>
    );
}
