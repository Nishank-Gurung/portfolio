"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useQueryGetBlogs } from "@/hooks/query-hooks/useQueryGetBlogs";
import { useEffect, useState } from "react";
import { showErrorTost } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useBlogMutation } from "@/hooks/mutation-hooks/blog-mutation";
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
import { Post } from "@/generated/prisma/client";
import PageSkeleton from "../skeleton/PageSkeleton";

export default function BlogPage({ error }: { error?: string }) {
    const { data: blogData, isLoading } = useQueryGetBlogs();
    const { deleteBlogMutation } = useBlogMutation();
    const router = useRouter();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
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

    if (isLoading || !blogData) {
         return <PageSkeleton/>;
    }

    const blogs = blogData || [];

    const handleEdit = (project: Post) => {
        router.push(`/admin/editor/blog?id=${project.id}`);
    };

    const handleDelete = (project: Post) => {
        setSelectedBlogId(project.id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedBlogId) return;
        deleteBlogMutation.mutate(selectedBlogId, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setSelectedBlogId(null);
            },
        });
    };

    return (
        <div className="container mx-auto ">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Blog Page</h1>
                    <p className="text-muted-foreground mt-1">
                        Total Blog Posts: {blogs.length}
                    </p>
                </div>
                <Button className="ml-auto">
                    <Link href="/admin/editor/blog">Add Blog Post</Link>
                </Button>
            </div>
            <div>
                {blogs.length === 0 ? (
                    <p className="text-muted-foreground mt-4">
                        No blog posts entries found. Click Add Blog Post to
                        create one.
                    </p>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Blog Title</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Seo Title</TableHead>
                                    {/* <TableHead>Views</TableHead> */}
                                    <TableHead className="w-[100px]">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {blogs.map((blog) => (
                                    <TableRow key={blog.id}>
                                        <TableCell>{blog.title}</TableCell>
                                        <TableCell>
                                            {blog.coverImage ? (
                                                <Image
                                                    src={blog.coverImage}
                                                    alt={blog.title}
                                                    width={28}
                                                    height={28}
                                                    className="size-7 object-contain"
                                                />
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    {blog.title}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>{blog.category}</TableCell>
                                        <TableCell>
                                            {blog.seoTitle || "No seo title"}
                                        </TableCell>
                                        {/* <TableCell>{blog.postViews}</TableCell> */}
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
                                                            handleEdit(blog)
                                                        }
                                                    >
                                                        <IconPencil className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleDelete(blog)
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
                isPending={deleteBlogMutation.isPending}
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={handleConfirmDelete}
            />
        </div>
    );
}
