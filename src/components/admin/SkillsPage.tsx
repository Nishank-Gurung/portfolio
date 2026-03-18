"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import DeleteModal from "../global/DeleteModal";
import Image from "next/image";

export default function SkillsPage({ error }: { error?: string }) {
    const { data: skillsData, isLoading } = useQueryGetSkills();
    const { deleteSkillMutation } = useSkillMutation();
    const router = useRouter();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
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

    if (isLoading || !skillsData) {
         return <PageSkeleton/>;
    }

    const skills: Skill[] = skillsData || [];

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
        <div className="container mx-auto ">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Skills Page</h1>
                    <p className="text-muted-foreground mt-1">
                        Total Skills: {skills.length}
                    </p>
                </div>
                <Button className="ml-auto">
                    <Link href="/admin/editor/skill">Add Skill</Link>
                </Button>
            </div>
            <div>
                {skills.length === 0 ? (
                    <p className="text-muted-foreground mt-4">
                        No skills entries found. Click Add Skill to create one.
                    </p>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Skill Name</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="w-[100px]">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {skills.map((skill) => (
                                    <TableRow key={skill.id}>
                                        <TableCell>{skill.name}</TableCell>
                                        <TableCell>
                                            {skill.image ? (
                                                <Image
                                                    src={skill.image}
                                                    alt={skill.name}
                                                    width={28}
                                                    height={28}
                                                    className="size-7 object-contain"
                                                />
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    {skill.name}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>{skill.category}</TableCell>

                                        <TableCell className="w-[100px]">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <IconDots className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Open menu
                                                        </span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleEdit(skill)
                                                        }
                                                    >
                                                        <IconPencil className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleDelete(skill)
                                                        }
                                                    >
                                                        <IconTrash className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
            <DeleteModal
                isPending={deleteSkillMutation.isPending}
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={handleConfirmDelete}
            />
        </div>
    );
}
