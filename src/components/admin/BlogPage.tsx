"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { useQueryGetBlogs } from "@/hooks/query-hooks/useQueryGetBlogs";
import { useEffect, useState, useMemo } from "react";
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
    IconArticle,
    IconPencil,
    IconPlus,
    IconSearch,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
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

    const blogs: Post[] = useMemo(() => blogData || [], [blogData]);

    // Metrics
    const totalCount = blogs.length;

    // Filtered by search query
    const filteredBlogs = useMemo(() => {
        if (!searchQuery.trim()) return blogs;
        const q = searchQuery.toLowerCase();
        return blogs.filter(
            (b) =>
                b.title.toLowerCase().includes(q) ||
                b.slug.toLowerCase().includes(q),
        );
    }, [blogs, searchQuery]);

    if (isLoading || !blogData) {
        return <PageSkeleton />;
    }

    const handleEdit = (post: Post) => {
        router.push(`/admin/editor/blog?id=${post.id}`);
    };

    const handleDelete = (post: Post) => {
        setSelectedBlogId(post.id);
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
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border/60">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <IconArticle className="size-6" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Blog Articles
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                        Write, edit, and publish technical articles, tutorials, and development insights.
                    </p>
                </div>

                <Button asChild size="sm" className="font-semibold shadow-xs shrink-0">
                    <Link href="/admin/editor/blog">
                        <IconPlus className="size-4 mr-1.5" />
                        Write Article
                    </Link>
                </Button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-4 shadow-xs border border-border/60">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase font-mono">
                                Total Articles
                            </span>
                            <span className="text-2xl font-bold text-foreground block mt-1">
                                {totalCount}
                            </span>
                        </div>
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                            <IconArticle className="size-5" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4 shadow-xs border border-border/60">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase font-mono">
                                Status
                            </span>
                            <span className="text-sm text-emerald-500 font-medium block mt-1 flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                Publishing Ready
                            </span>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                            <IconArticle className="size-5" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <IconSearch className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                        placeholder="Search by article title or slug..."
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
            {filteredBlogs.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="p-3 rounded-full bg-muted text-muted-foreground mb-4">
                            <IconArticle className="size-8" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground mb-1">
                            {searchQuery ? "No matching articles found" : "No articles written yet"}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                            {searchQuery
                                ? `No article entries matched "${searchQuery}". Try clearing your search filter.`
                                : "Share tutorials, guides, and engineering learnings by publishing your first article."}
                        </p>
                        {searchQuery ? (
                            <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                                Clear Search
                            </Button>
                        ) : (
                            <Button asChild size="sm">
                                <Link href="/admin/editor/blog">
                                    <IconPlus className="size-4 mr-1.5" />
                                    Write First Article
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
                                <TableHead className="w-[60px]">Cover</TableHead>
                                <TableHead>Article Title</TableHead>
                                <TableHead>URL Slug</TableHead>
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBlogs.map((post) => (
                                <TableRow key={post.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <div className="size-10 rounded-lg overflow-hidden border border-border/60 bg-muted flex items-center justify-center relative shrink-0">
                                            {post.coverImage ? (
                                                <Image
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <IconArticle className="size-5 text-muted-foreground" />
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <span className="font-semibold text-foreground">
                                            {post.title}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant="outline" className="text-xs font-mono">
                                            /{post.slug}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => handleEdit(post)}
                                                className="text-muted-foreground hover:text-foreground hover:bg-muted"
                                                title="Edit Article"
                                            >
                                                <IconPencil className="size-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => handleDelete(post)}
                                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                title="Delete Article"
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
                isPending={deleteBlogMutation.isPending}
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={handleConfirmDelete}
            />
        </div>
    );
}
