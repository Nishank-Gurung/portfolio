"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { skill } from "@/lib/types";
import { useEffect, useState, useTransition } from "react";
import { showErrorTost, showSuccessToast } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryGetSkills } from "@/hooks/query-hooks/useQueryGetSkills";
import APIRequest from "@/lib/BackendReq";
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
import PageSkeleton from "../skeleton/PageSkeleton";

export default function SkillsPage({ error }: { error?: string }) {
    const { data: skillsData, isLoading } = useQueryGetSkills();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
    const queryClient = useQueryClient();
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

    if (isLoading || !skillsData?.data?.skill) {
         return <PageSkeleton/>;
    }

    const skills: skill[] = skillsData.data.skill || [];

    const handleEdit = (skill: skill) => {
        router.push(`/admin/editor/skill?id=${skill.id}`);
    };

    const handleDelete = (skill: skill) => {
        setSelectedSkillId(skill.id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            startTransition(async () => {
                const res = await APIRequest.delete(
                    `/api/skill/${selectedSkillId}`,
                );
                if (!res.data.success) {
                    showErrorTost("Failed to delete skill");
                }
                showSuccessToast(res.data.message);
                setDeleteModalOpen(false);
                setSelectedSkillId(null);
                queryClient.invalidateQueries({ queryKey: ["skills"] });
            });
        } catch (error) {
            showErrorTost("Failed to delete skill");
            showErrorTost((error as Error).message);
            console.log(error);
        }
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
                isPending={isPending}
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={handleConfirmDelete}
            />
        </div>
    );
}
