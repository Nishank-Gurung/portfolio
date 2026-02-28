"use client";

import Link from "next/link";
import WorkForm from "../forms/WorkForm";
import { Button } from "../ui/button";
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
import { useQueryGetExperiences } from "@/hooks/query-hooks/useQueryGetExperiences";
import { experience } from "@/lib/types";
import PageSkeleton from "../skeleton/PageSkeleton";

export default function ExperiencesPage({ error }: { error?: string }) {
    const { data: experienceData, isLoading } = useQueryGetExperiences();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedExperienceId, setSelectedExperienceId] = useState<
        number | null
    >(null);
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

    if (isLoading || !experienceData?.data?.work) {
         return <PageSkeleton/>;
    }

    const experiences: experience[] = experienceData.data.work || [];

    const handleEdit = (exp: experience) => {
        router.push(`/admin/editor/experience?id=${exp.id}`);
    };

    const handleDelete = (exp: experience) => {
        setSelectedExperienceId(exp.id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            startTransition(async () => {
                const res = await APIRequest.delete(
                    `/api/experience/${selectedExperienceId}`,
                );
                if (!res.data.success) {
                    showErrorTost("Failed to delete experience");
                }
                showSuccessToast(res.data.message);
                setDeleteModalOpen(false);
                setSelectedExperienceId(null);
                queryClient.invalidateQueries({ queryKey: ["experiences"] });
            });
        } catch (error) {
            showErrorTost("Failed to delete experience");
            showErrorTost((error as Error).message);
            console.log(error);
        }
    };
    return (
        <div className="container mx-auto ">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Experiences Page</h1>
                    <p className="text-muted-foreground mt-1">
                        Total Experiences: {experiences.length}
                    </p>
                </div>
                <Button className="ml-auto">
                    <Link href="/admin/editor/experience">Add Experience</Link>
                </Button>
            </div>
            <div>
                {experiences.length === 0 ? (
                    <p className="text-muted-foreground mt-4">
                        No experience entries found. Click Add Experience to
                        create one.
                    </p>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead className="w-[100px]">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {experiences.map((exp) => (
                                    <TableRow key={exp.id}>
                                        <TableCell>{exp.company}</TableCell>
                                        <TableCell>{exp.position}</TableCell>
                                        <TableCell>{exp.type}</TableCell>
                                        <TableCell>
                                            {new Date(
                                                exp.startDate,
                                            ).toDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {exp.endDate
                                                ? new Date(
                                                      exp.endDate,
                                                  ).toDateString()
                                                : "Present"}
                                        </TableCell>
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
                                                            handleEdit(exp)
                                                        }
                                                    >
                                                        <IconPencil className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleDelete(exp)
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
