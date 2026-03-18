"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import DeleteModal from "../global/DeleteModal";
import Image from "next/image";

export default function ProjectsPage({ error }: { error?: string }) {
    const { data: projectsData, isLoading } = useQueryGetProjects();
    const { deleteProjectMutation } = useProjectMutation();
    const router = useRouter();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
        null,
    );
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

    if (isLoading || !projectsData) {
        return <PageSkeleton/>;
    }

    const projects: Project[] = projectsData || [];

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
        <div className="container mx-auto ">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Projects Page</h1>
                    <p className="text-muted-foreground mt-1">
                        Total Projects: {projects.length}
                    </p>
                </div>
                <Button className="ml-auto">
                    <Link href="/admin/editor/project">Add Project</Link>
                </Button>
            </div>
            <div>
                {projects.length === 0 ? (
                    <p className="text-muted-foreground mt-4">
                        No projects entries found. Click Add Project to create
                        one.
                    </p>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Project Name</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>URl</TableHead>
                                    <TableHead className="w-[100px]">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell>{project.title}</TableCell>
                                        <TableCell>
                                            {project.image ? (
                                                <Image
                                                    src={project.image}
                                                    alt={project.title}
                                                    width={28}
                                                    height={28}
                                                    className="size-7 object-contain"
                                                />
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    {project.title}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {project.category}
                                        </TableCell>
                                        <TableCell>
                                            {project.url ? (
                                                <a
                                                    href={project.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    {project.url}
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    No URL
                                                </span>
                                            )}
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
                                                            handleEdit(project)
                                                        }
                                                    >
                                                        <IconPencil className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleDelete(
                                                                project,
                                                            )
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
                isPending={deleteProjectMutation.isPending}
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={handleConfirmDelete}
            />
        </div>
    );
}
