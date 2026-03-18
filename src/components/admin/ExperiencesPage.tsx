"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { showErrorTost } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useQueryGetExperiences } from "@/hooks/query-hooks/useQueryGetExperiences";
import PageSkeleton from "../skeleton/PageSkeleton";
import { WorkExperience } from "@/generated/prisma/client";
import { useWorkMutation } from "@/hooks/mutation-hooks/work-mutation";
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

export default function ExperiencesPage({ error }: { error?: string }) {
    const { data: experienceData, isLoading } = useQueryGetExperiences();
    const { deleteWorkMutation } = useWorkMutation();
    const router = useRouter();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedExperienceId, setSelectedExperienceId] = useState<
        number | null
    >(null);
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

    if (isLoading || !experienceData) {
         return <PageSkeleton/>;
    }

    const experiences: WorkExperience[] = experienceData || [];

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
                isPending={deleteWorkMutation.isPending}
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={handleConfirmDelete}
            />
        </div>
    );
}
