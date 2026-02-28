"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect, useState, useTransition } from "react";
import { showErrorTost, showSuccessToast } from "@/lib/utils";
import { useQueryGetEducations } from "@/hooks/query-hooks/useQueryGetEducations";
import { education } from "@/lib/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import {
    IconDots,
    IconPencil,
    IconTrash,
} from "@tabler/icons-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import DeleteModal from "../global/DeleteModal";
import APIRequest from "@/lib/BackendReq";
import { useQueryClient } from "@tanstack/react-query";
import PageSkeleton from "../skeleton/PageSkeleton";

export default function EducationsPage({ error }: { error?: string }) {
    const { data: educationData, isLoading } = useQueryGetEducations();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedEducationId, setSelectedEducationId] = useState<
        number | null
    >(null);
     const queryClient = useQueryClient()
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

    if (isLoading || !educationData?.data?.education) {
         return <PageSkeleton/>;
    }

    const education: education[] = educationData.data.education || [];
 

    const handleEdit = (edu: education) => {
        router.push(`/admin/editor/education?id=${edu.id}`);
    };

    const handleDelete = (edu: education) => {
        setSelectedEducationId(edu.id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            startTransition(async () => {
                const res = await APIRequest.delete(`/api/education/${selectedEducationId}`);
                if (!res.data.success) {
                    showErrorTost("Failed to delete education");
                }
                showSuccessToast(res.data.message)
                setDeleteModalOpen(false);
                setSelectedEducationId(null);
                        queryClient.invalidateQueries({queryKey: ['educations']})

            });
        } catch (error) {
            showErrorTost("Failed to delete education");
            showErrorTost((error as Error).message);
            console.log(error)
        }
    }
    return (
        <div className="container mx-auto ">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Educations Page</h1>
                    <p className="text-muted-foreground mt-1">
                        Total Educations: {education.length}
                    </p>
                </div>
                <Button className="ml-auto">
                    <Link href="/admin/editor/education">Add Education</Link>
                </Button>
            </div>
            <div>
                {education.length === 0 ? (
                    <p className="text-muted-foreground mt-4">
                        No education entries found. Click Add Education to
                        create one.
                    </p>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Institution</TableHead>
                                    <TableHead>Degree</TableHead>
                                    <TableHead>Field</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead className="w-[100px]">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {education.map((edu) => (
                                    <TableRow key={edu.id}>
                                        <TableCell>{edu.institution}</TableCell>
                                        <TableCell>{edu.degree}</TableCell>
                                        <TableCell>{edu.field}</TableCell>
                                        <TableCell>
                                            {new Date(edu.startDate).toDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {edu.endDate
                                                ? new Date(edu.endDate).toDateString()
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
                                                            handleEdit(edu)
                                                        }
                                                    >
                                                        <IconPencil className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleDelete(edu)
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
            <DeleteModal isPending={isPending} isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onDelete={handleConfirmDelete}/>
        </div>
    );
}
