"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { useEffect, useState, useMemo } from "react";
import { showErrorTost } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useQueryGetSocials } from "@/hooks/query-hooks/useQueryGetSocials";
import PageSkeleton from "../skeleton/PageSkeleton";
import { socialMedia } from "@/lib/types";
import { useSocialMutation } from "@/hooks/mutation-hooks/social-mutation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import {
    IconExternalLink,
    IconPencil,
    IconPlus,
    IconSearch,
    IconShare,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
import DeleteModal from "../global/DeleteModal";
import Image from "next/image";

export default function SocialsPage({ error }: { error?: string }) {
    const { data: socialsData, isLoading } = useQueryGetSocials();
    const { deleteSocialMutation } = useSocialMutation();
    const router = useRouter();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSocialId, setSelectedSocialId] = useState<number | null>(null);
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

    const socials: socialMedia[] = useMemo(() => socialsData || [], [socialsData]);

    // Metrics
    const totalCount = socials.length;

    // Filtered by search query
    const filteredSocials = useMemo(() => {
        if (!searchQuery.trim()) return socials;
        const q = searchQuery.toLowerCase();
        return socials.filter(
            (s) =>
                s.platform.toLowerCase().includes(q) ||
                s.url?.toLowerCase().includes(q),
        );
    }, [socials, searchQuery]);

    if (isLoading || !socialsData) {
        return <PageSkeleton />;
    }

    const handleEdit = (social: socialMedia) => {
        router.push(`/admin/editor/social?id=${social.id}`);
    };

    const handleDelete = (social: socialMedia) => {
        setSelectedSocialId(social.id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedSocialId) return;
        deleteSocialMutation.mutate(selectedSocialId, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setSelectedSocialId(null);
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
                            <IconShare className="size-6" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Social Media Links
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                        Configure public social profiles, GitHub, LinkedIn, and developer channels shown across the site.
                    </p>
                </div>

                <Button asChild size="sm" className="font-semibold shadow-xs shrink-0">
                    <Link href="/admin/editor/social">
                        <IconPlus className="size-4 mr-1.5" />
                        Add Social Link
                    </Link>
                </Button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-4 shadow-xs border border-border/60">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase font-mono">
                                Configured Channels
                            </span>
                            <span className="text-2xl font-bold text-foreground block mt-1">
                                {totalCount}
                            </span>
                        </div>
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                            <IconShare className="size-5" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4 shadow-xs border border-border/60">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase font-mono">
                                Display Placements
                            </span>
                            <span className="text-sm text-muted-foreground block mt-1">
                                Hero Section & Contact Dock
                            </span>
                        </div>
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                            <IconExternalLink className="size-5" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <IconSearch className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                        placeholder="Search by platform name or URL..."
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
            {filteredSocials.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="p-3 rounded-full bg-muted text-muted-foreground mb-4">
                            <IconShare className="size-8" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground mb-1">
                            {searchQuery ? "No matching socials found" : "No social profiles registered yet"}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                            {searchQuery
                                ? `No platforms matched "${searchQuery}". Try clearing your search.`
                                : "Add your GitHub, LinkedIn, X, or email link so visitors can easily connect with you."}
                        </p>
                        {searchQuery ? (
                            <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                                Clear Search
                            </Button>
                        ) : (
                            <Button asChild size="sm">
                                <Link href="/admin/editor/social">
                                    <IconPlus className="size-4 mr-1.5" />
                                    Add First Social Link
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
                                <TableHead>Social Platform</TableHead>
                                <TableHead>Target URL</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSocials.map((social) => (
                                <TableRow key={social.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <div className="size-10 rounded-lg overflow-hidden border border-border/60 bg-secondary/80 flex items-center justify-center relative shrink-0">
                                            {social.image ? (
                                                <Image
                                                    src={social.image}
                                                    alt={social.platform}
                                                    width={24}
                                                    height={24}
                                                    className="size-6 object-contain"
                                                />
                                            ) : (
                                                <IconShare className="size-5 text-muted-foreground" />
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <span className="font-semibold text-foreground">
                                            {social.platform}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        {social.url ? (
                                            <a
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent truncate max-w-xs transition-colors"
                                                title={social.url}
                                            >
                                                <span className="truncate">{social.url}</span>
                                                <IconExternalLink className="size-3 shrink-0" />
                                            </a>
                                        ) : (
                                            <span className="text-xs text-muted-foreground font-mono">—</span>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant="outline" className="text-xs font-mono">
                                            #{social.order}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => handleEdit(social)}
                                                className="text-muted-foreground hover:text-foreground hover:bg-muted"
                                                title="Edit Social Link"
                                            >
                                                <IconPencil className="size-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => handleDelete(social)}
                                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                title="Delete Social Link"
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
                isPending={deleteSocialMutation.isPending}
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={handleConfirmDelete}
            />
        </div>
    );
}
